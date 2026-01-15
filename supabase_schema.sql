-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- PROFILES (Public info for users)
create table profiles (
  id uuid references auth.users not null primary key,
  discord_id text unique,
  username text,
  avatar_url text,
  updated_at timestamp with time zone,
  
  constraint username_length check (char_length(username) >= 3)
);

-- SERVERS
create table servers (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  slug text unique not null,
  description text,
  cover_image_url text,
  discord_invite_url text,
  owner_id uuid references auth.users not null,
  
  constraint slug_length check (char_length(slug) >= 3)
);

-- JOBS (Recruitment Positions)
create table jobs (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  server_id uuid references servers(id) on delete cascade not null,
  title text not null,
  is_open boolean default true,
  form_schema jsonb default '[]'::jsonb, -- Stores the form builder structure
  
  constraint title_length check (char_length(title) >= 3)
);

-- SERVER MEMBERS (Staff/Roles)
create type member_role as enum ('admin', 'manager', 'viewer');

create table server_members (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references profiles(id) on delete cascade not null,
  server_id uuid references servers(id) on delete cascade not null,
  role member_role default 'viewer',
  job_id uuid references jobs(id) on delete set null, -- If null, global access. If set, restricted to that job.
  
  unique(user_id, server_id)
);

-- APPLICATIONS
create type application_status as enum ('pending', 'interview', 'accepted', 'rejected');

create table applications (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  job_id uuid references jobs(id) on delete cascade not null,
  candidate_id uuid references profiles(id) on delete cascade not null,
  status application_status default 'pending',
  answers jsonb default '{}'::jsonb -- Stores form answers
);

-- SERVER INVITES
create table server_invites (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  server_id uuid references servers(id) on delete cascade not null,
  code text unique not null,
  role member_role default 'viewer',
  used_count int default 0,
  max_uses int default 1 -- Single use by default, or unlimited
);
alter table server_invites enable row level security;

-- INVITES Policies
create policy "Server admins can view invites." on server_invites for select using (
  exists (
    select 1 from server_members
    where server_members.server_id = server_invites.server_id
    and server_members.user_id = auth.uid()
    and server_members.role in ('admin', 'manager')
  )
  or 
  exists (
    select 1 from servers
    where servers.id = server_invites.server_id
    and servers.owner_id = auth.uid()
  )
);

create policy "Server admins can create invites." on server_invites for insert with check (
   exists (
    select 1 from servers
    where servers.id = server_invites.server_id
    and servers.owner_id = auth.uid()
  )
);

-- Note: Public needs to be able to read invite by code to accept it? 
-- Actually, we can use a secure function to accept, or allow public select on specific code.
create policy "Anyone can read invite by code." on server_invites for select using (true);



-- ROW LEVEL SECURITY (RLS) --

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table servers enable row level security;
alter table jobs enable row level security;
alter table server_members enable row level security;
alter table applications enable row level security;

-- PROFILES Policies
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- SERVERS Policies
create policy "Servers are viewable by everyone." on servers for select using (true);
create policy "Users can create servers." on servers for insert with check (auth.uid() = owner_id);
create policy "Owners can update servers." on servers for update using (auth.uid() = owner_id);

-- JOBS Policies
create policy "Jobs are viewable by everyone." on jobs for select using (true);
create policy "Server admins/managers can manage jobs." on jobs for all using (
  exists (
    select 1 from server_members
    where server_members.server_id = jobs.server_id
    and server_members.user_id = auth.uid()
    and server_members.role in ('admin', 'manager')
  )
  or 
  exists (
    select 1 from servers
    where servers.id = jobs.server_id
    and servers.owner_id = auth.uid()
  )
);

-- SERVER MEMBERS Policies
create policy "Members are viewable by everyone." on server_members for select using (true);
create policy "Owners and Admins can manage members." on server_members for all using (
  exists (
    select 1 from servers
    where servers.id = server_members.server_id
    and servers.owner_id = auth.uid()
  )
  or
  exists (
    select 1 from server_members sm
    where sm.server_id = server_members.server_id
    and sm.user_id = auth.uid()
    and sm.role = 'admin'
  )
);

-- APPLICATIONS Policies
create policy "Candidates can view their own applications." on applications for select using (auth.uid() = candidate_id);
create policy "Staff can view applications for their server/job." on applications for select using (
  exists (
    select 1 from jobs j
    join server_members sm on sm.server_id = j.server_id
    where j.id = applications.job_id
    and sm.user_id = auth.uid()
    and (sm.job_id is null or sm.job_id = j.id) -- Global access or specific job access
  )
  or
  exists (
    select 1 from jobs j
    join servers s on s.id = j.server_id
    where j.id = applications.job_id
    and s.owner_id = auth.uid()
  )
);

create policy "Authenticated users can apply." on applications for insert with check (auth.uid() = candidate_id);

-- TRIGGERS --

-- Auto-create profile on signup (handled via Supabase Auth hook usually, but good to have prepared)
-- This function would be called by Supabase Auth trigger
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- SECURE INVITE ACCEPTANCE FUNCTION
create or replace function join_server_with_invite(invite_code text)
returns json as $$
declare
  invite_record record;
  user_id uuid;
  new_member_id uuid;
begin
  -- Get current user
  user_id := auth.uid();
  if user_id is null then
    return json_build_object('success', false, 'error', 'User not authenticated');
  end if;

  -- Verify Invite
  select * into invite_record from server_invites where code = invite_code;
  
  if invite_record is null then
    return json_build_object('success', false, 'error', 'Invalid invite code');
  end if;

  -- Check limits
  if invite_record.max_uses is not null and invite_record.used_count >= invite_record.max_uses then
     return json_build_object('success', false, 'error', 'Invite limit reached');
  end if;

  -- Check if already member
  if exists (select 1 from server_members where server_members.server_id = invite_record.server_id and server_members.user_id = user_id) then
     return json_build_object('success', true, 'message', 'Already a member', 'server_id', invite_record.server_id);
  end if;

  -- Add Member
  insert into server_members (server_id, user_id, role)
  values (invite_record.server_id, user_id, invite_record.role);

  -- Update Invite Count
  update server_invites set used_count = used_count + 1 where id = invite_record.id;
  
  -- Cleanup if max uses reached (optional, or just rely on check)
  if invite_record.max_uses is not null and (invite_record.used_count + 1) >= invite_record.max_uses then
      delete from server_invites where id = invite_record.id;
  end if;

  return json_build_object('success', true, 'server_id', invite_record.server_id);
end;
$$ language plpgsql security definer;
- -   L I C E N S E S   S Y S T E M  
  
 c r e a t e   t y p e   l i c e n s e _ p l a n   a s   e n u m   ( ' f r e e ' ,   ' p r o ' ,   ' e n t e r p r i s e ' ) ;  
  
 c r e a t e   t a b l e   l i c e n s e s   (  
     i d   u u i d   d e f a u l t   u u i d _ g e n e r a t e _ v 4 ( )   p r i m a r y   k e y ,  
     c r e a t e d _ a t   t i m e s t a m p   w i t h   t i m e   z o n e   d e f a u l t   t i m e z o n e ( ' u t c ' : : t e x t ,   n o w ( ) )   n o t   n u l l ,  
     k e y   t e x t   u n i q u e   n o t   n u l l ,  
     p l a n   l i c e n s e _ p l a n   d e f a u l t   ' p r o ' ,  
     m a x _ j o b s   i n t   d e f a u l t   5 ,   - -   D e f a u l t   l i m i t   f o r   p a i d   p l a n  
     e x p i r e s _ a t   t i m e s t a m p   w i t h   t i m e   z o n e ,  
      
     - -   L i n k i n g   t o   s e r v e r  
     s e r v e r _ i d   u u i d   r e f e r e n c e s   s e r v e r s ( i d ) ,  
     c l a i m e d _ a t   t i m e s t a m p   w i t h   t i m e   z o n e  
 ) ;  
  
 a l t e r   t a b l e   l i c e n s e s   e n a b l e   r o w   l e v e l   s e c u r i t y ;  
  
 - -   P o l i c i e s  
 - -   S e r v e r   o w n e r s   c a n   v i e w   t h e   l i c e n s e   a t t a c h e d   t o   t h e i r   s e r v e r  
 c r e a t e   p o l i c y   " O w n e r s   c a n   v i e w   t h e i r   s e r v e r   l i c e n s e . "   o n   l i c e n s e s   f o r   s e l e c t   u s i n g   (  
     e x i s t s   (  
         s e l e c t   1   f r o m   s e r v e r s  
         w h e r e   s e r v e r s . i d   =   l i c e n s e s . s e r v e r _ i d  
         a n d   s e r v e r s . o w n e r _ i d   =   a u t h . u i d ( )  
     )  
 ) ;  
  
 - -   B u t   a c t u a l l y ,   w e   m i g h t   w a n t   a   ' c h e c k _ l i c e n s e '   R P C   o r   j u s t   s e c u r e   s e r v e r   a c t i o n .  
 - -   F o r   s i m p l e   k e y   a c t i v a t i o n ,   w e   w i l l   s t r i c t l y   u s e   a   P o s t g r e s   F u n c t i o n   ( R P C )   t o   c l a i m   i t   s e c u r e l y .  
  
 c r e a t e   o r   r e p l a c e   f u n c t i o n   c l a i m _ l i c e n s e ( p _ s e r v e r _ i d   u u i d ,   p _ l i c e n s e _ k e y   t e x t )  
 r e t u r n s   j s o n   a s   $ $  
 d e c l a r e  
     v _ l i c e n s e _ r e c o r d   r e c o r d ;  
     v _ u s e r _ i d   u u i d ;  
 b e g i n  
     v _ u s e r _ i d   : =   a u t h . u i d ( ) ;  
      
     - -   C h e c k   i f   u s e r   o w n s   t h e   s e r v e r  
     i f   n o t   e x i s t s   ( s e l e c t   1   f r o m   s e r v e r s   w h e r e   i d   =   p _ s e r v e r _ i d   a n d   o w n e r _ i d   =   v _ u s e r _ i d )   t h e n  
           r e t u r n   j s o n _ b u i l d _ o b j e c t ( ' s u c c e s s ' ,   f a l s e ,   ' e r r o r ' ,   ' P e r m i s s i o n   d e n i e d ' ) ;  
     e n d   i f ;  
  
     - -   F i n d   t h e   l i c e n s e  
     s e l e c t   *   i n t o   v _ l i c e n s e _ r e c o r d   f r o m   l i c e n s e s   w h e r e   k e y   =   p _ l i c e n s e _ k e y ;  
      
     i f   v _ l i c e n s e _ r e c o r d   i s   n u l l   t h e n  
           r e t u r n   j s o n _ b u i l d _ o b j e c t ( ' s u c c e s s ' ,   f a l s e ,   ' e r r o r ' ,   ' I n v a l i d   l i c e n s e   k e y ' ) ;  
     e n d   i f ;  
  
     i f   v _ l i c e n s e _ r e c o r d . s e r v e r _ i d   i s   n o t   n u l l   t h e n  
           r e t u r n   j s o n _ b u i l d _ o b j e c t ( ' s u c c e s s ' ,   f a l s e ,   ' e r r o r ' ,   ' L i c e n s e   a l r e a d y   c l a i m e d ' ) ;  
     e n d   i f ;  
  
     - -   C l a i m   i t  
     u p d a t e   l i c e n s e s    
     s e t   s e r v e r _ i d   =   p _ s e r v e r _ i d ,   c l a i m e d _ a t   =   n o w ( )  
     w h e r e   i d   =   v _ l i c e n s e _ r e c o r d . i d ;  
  
     r e t u r n   j s o n _ b u i l d _ o b j e c t ( ' s u c c e s s ' ,   t r u e ,   ' p l a n ' ,   v _ l i c e n s e _ r e c o r d . p l a n ) ;  
 e n d ;  
 $ $   l a n g u a g e   p l p g s q l   s e c u r i t y   d e f i n e r ;  
  
 - -   F u n c t i o n   t o   c h e c k   l i m i t s  
 c r e a t e   o r   r e p l a c e   f u n c t i o n   c h e c k _ s e r v e r _ l i m i t ( p _ s e r v e r _ i d   u u i d )  
 r e t u r n s   j s o n   a s   $ $  
 d e c l a r e  
     v _ c u r r e n t _ j o b s   i n t ;  
     v _ m a x _ j o b s   i n t ;  
     v _ l i c e n s e   r e c o r d ;  
 b e g i n  
     - -   G e t   a c t i v e   l i c e n s e  
     s e l e c t   *   i n t o   v _ l i c e n s e   f r o m   l i c e n s e s    
     w h e r e   s e r v e r _ i d   =   p _ s e r v e r _ i d    
     a n d   ( e x p i r e s _ a t   i s   n u l l   o r   e x p i r e s _ a t   >   n o w ( ) )  
     o r d e r   b y   c r e a t e d _ a t   d e s c   l i m i t   1 ;  
  
     - -   D e f a u l t   l i m i t   i f   n o   l i c e n s e   ( F r e e   T i e r )  
     i f   v _ l i c e n s e   i s   n u l l   t h e n  
           v _ m a x _ j o b s   : =   1 ;   - -   F r e e   t i e r   l i m i t  
     e l s e  
           v _ m a x _ j o b s   : =   v _ l i c e n s e . m a x _ j o b s ;  
     e n d   i f ;  
  
     s e l e c t   c o u n t ( * )   i n t o   v _ c u r r e n t _ j o b s   f r o m   j o b s   w h e r e   s e r v e r _ i d   =   p _ s e r v e r _ i d ;  
  
     r e t u r n   j s o n _ b u i l d _ o b j e c t (  
         ' a l l o w e d ' ,   v _ c u r r e n t _ j o b s   <   v _ m a x _ j o b s ,  
         ' c u r r e n t ' ,   v _ c u r r e n t _ j o b s ,  
         ' m a x ' ,   v _ m a x _ j o b s ,  
         ' p l a n ' ,   c o a l e s c e ( v _ l i c e n s e . p l a n : : t e x t ,   ' f r e e ' )  
     ) ;  
 e n d ;  
 $ $   l a n g u a g e   p l p g s q l   s e c u r i t y   d e f i n e r ;  
 
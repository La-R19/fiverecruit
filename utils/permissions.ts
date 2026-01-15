import { createClient } from "./supabase/server";
import { PermissionKey, DEFAULT_PERMISSIONS } from "./permissions-types";

// Re-export for server components convenience if needed, or they can import from types directly.
// But we mainly need checkPermission here.

export async function checkPermission(
    serverId: string,
    permission: PermissionKey,
    context?: { jobId?: string }
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    // 1. Fetch Server owner and Member role/permissions
    const { data: server } = await supabase
        .from('servers')
        .select('owner_id, role_permissions')
        .eq('id', serverId)
        .single();

    if (!server) return false;

    // Owner has all permissions
    if (server.owner_id === user.id) return true;

    // 2. Fetch Member Role & Specifics
    const { data: member } = await supabase
        .from('server_members')
        .select('role, specific_permissions, job_id')
        .eq('server_id', serverId)
        .eq('user_id', user.id)
        .single();

    if (!member) return false;

    // 3. Check Job Restriction (Multi-job restriction logic)
    // If member is restricted to a specific job_id, and we are checking context for a DIFFERENT job_id
    if (member.job_id && context?.jobId && member.job_id !== context.jobId) {
        // If checking generic permissions (like 'can_view_stats'), passing a jobId context might logically failing
        // if we consider stats are global.
        // But usually, if restricted to a job, they shouldn't edit *other* jobs.
        return false;
    }

    // 4. Specific Permission Override
    const specificPerms = member.specific_permissions as any;
    // console.log(`[CheckPerm] ${permission} for ${member.role}. Specifics:`, specificPerms)

    if (specificPerms && typeof specificPerms[permission] === 'boolean') {
        // console.log(`[CheckPerm] Override applied: ${specificPerms[permission]}`)
        return specificPerms[permission];
    }

    // 5. Role Fallback
    if (member.role === 'admin') return true;
    if (member.role === 'viewer') return false;

    if (member.role === 'manager') {
        const permissions = server.role_permissions as any;
        const managerPerms = permissions?.manager || DEFAULT_PERMISSIONS.manager;
        // console.log(`[CheckPerm] Manager default: ${!!managerPerms[permission]}`)
        return !!managerPerms[permission];
    }

    return false;
}

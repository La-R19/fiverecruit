
import { createClient } from "@/utils/supabase/server"
import { notFound, redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { MemberEditForm } from "./member-edit-form"
import { DEFAULT_PERMISSIONS } from "@/utils/permissions-types"

export default async function MemberPage(props: { params: Promise<{ serverId: string; memberId: string }> }) {
    const params = await props.params;
    const { serverId, memberId } = params
    const supabase = await createClient()

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Fetch Server (for context & perm checks)
    const { data: server } = await supabase.from('servers').select('*').eq('id', serverId).single()
    if (!server) notFound()

    if (server.owner_id !== user.id) {
        return redirect(`/dashboard/server/${serverId}`)
    }

    // Fetch Member
    const { data: member } = await supabase
        .from('server_members')
        .select('*, profiles(*)')
        .eq('id', memberId)
        .single()

    if (!member) notFound()

    // Fetch Jobs for Dropdown
    const { data: jobs } = await supabase.from('jobs').select('id, title').eq('server_id', serverId)

    // Merge Permissions for Initial State
    // Default Role Perms
    const rawRolePerms = (server.role_permissions as any)?.[member.role] || {};
    const roleDefaultPerms = { ...(DEFAULT_PERMISSIONS.manager || {}), ...rawRolePerms };
    // Specific Overrides
    const specificPerms = member.specific_permissions as any || {}

    // Combined effective? No, for editing we want to see what is OVERRIDDEN vs Default.
    // The form will handle "Inherit" vs "True/False" logic if we want complex UI.
    // simpler: Just show toggles. If checked/unchecked, it sets explicit true/false.

    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href={`/dashboard/server/${serverId}/team`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Modifier le membre</h1>
                    <p className="text-sm text-muted-foreground">{member.profiles?.username}</p>
                </div>
            </div>

            <MemberEditForm
                key={JSON.stringify(member)}
                serverId={serverId}
                memberId={memberId}
                initialData={member}
                jobs={jobs || []}
                serverRolePermissions={{
                    ...((server.role_permissions as any) || {}),
                    manager: { ...DEFAULT_PERMISSIONS.manager, ...((server.role_permissions as any)?.manager || {}) }
                }}
            />
        </div>
    )
}


import { createClient } from "@/utils/supabase/server"
import { notFound, redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { PermissionsForm } from "./permissions-form"
import { DEFAULT_PERMISSIONS } from "@/utils/permissions-types"

export default async function RolesPage(props: { params: Promise<{ serverId: string }> }) {
    const params = await props.params;
    const { serverId } = params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: server } = await supabase
        .from('servers')
        .select('*')
        .eq('id', serverId)
        .single()

    if (!server) notFound()

    // Must be Owner to view this page (or Admin?)
    // Let's restrict to Owner for high-level security changes
    if (server.owner_id !== user.id) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-xl font-bold text-red-500">Accès Refusé</h1>
                <p>Seul le propriétaire peut modifier les permissions.</p>
                <Link href={`/dashboard/server/${serverId}`}>
                    <Button variant="link">Retour</Button>
                </Link>
            </div>
        )
    }

    const rawPermissions = (server.role_permissions as any)?.manager || {};
    const currentPermissions = { ...DEFAULT_PERMISSIONS.manager, ...rawPermissions };

    return (
        <div className="space-y-8 max-w-3xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href={`/dashboard/server/${serverId}/settings`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Permissions Manager</h1>
                    <p className="text-sm text-muted-foreground">Définissez ce que les managers peuvent faire sur ce serveur.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Rôle Manager</CardTitle>
                    <CardDescription>Cochez les actions autorisées.</CardDescription>
                </CardHeader>
                <CardContent>
                    <PermissionsForm
                        serverId={serverId}
                        initialPermissions={currentPermissions}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

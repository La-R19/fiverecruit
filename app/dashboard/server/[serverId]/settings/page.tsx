
import { createClient } from "@/utils/supabase/server"
import { notFound, redirect } from "next/navigation"
import { ServerSettingsForm } from "./server-settings-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"


export default async function SettingsPage(props: { params: Promise<{ serverId: string }> }) {
    const params = await props.params;
    const { serverId } = params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Fetch Server
    const { data: server } = await supabase
        .from('servers')
        .select('*')
        .eq('id', serverId)
        .single()

    if (!server) notFound()

    // Security Check
    // Security Check
    const { checkPermission } = await import("@/utils/permissions")
    const canEdit = await checkPermission(serverId, 'can_edit_server')
    const canDelete = await checkPermission(serverId, 'can_delete_server')

    if (!canEdit && !canDelete) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <div className="p-4 rounded-full bg-red-100">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Accès Refusé</h1>
                <p className="text-gray-500">Vous n'avez pas la permission de modifier les paramètres de ce serveur.</p>
                <Link href={`/dashboard/server/${serverId}`}>
                    <Button variant="outline">Retour au Dashboard</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href={`/dashboard/server/${serverId}`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Paramètres du Serveur</h1>
                    <p className="text-sm text-muted-foreground">Gérez les informations publiques de votre serveur.</p>
                </div>
                <div className="flex gap-2">
                    <Link href={`/dashboard/server/${serverId}/settings/roles`}>
                        <Button variant="outline">
                            Gérer les Rôles
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold mb-4">Informations Générales</h2>
                <ServerSettingsForm server={server} canDelete={canDelete} canEdit={canEdit} />
            </div>
        </div>
    )
}

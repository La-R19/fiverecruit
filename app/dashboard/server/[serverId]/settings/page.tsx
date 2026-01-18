
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
    if (server.owner_id !== user.id) redirect('/dashboard')

        < Link href = {`/dashboard/server/${serverId}/settings/roles`
}>
    <Button variant="outline">
        Gérer les Rôles
    </Button>
                    </Link >
    <Link href={`/dashboard/server/${serverId}/settings/subscription`}>
        <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
            Abonnement
        </Button>
    </Link>
                </div >
            </div >



    <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4">Informations Générales</h2>
        <ServerSettingsForm server={server} />
    </div>
        </div >
    )
}


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

    // Fetch Current License Info
    const { data: license } = await supabase
        .from('licenses')
        .select('*')
        .eq('server_id', serverId)
        // .gte('expires_at', new Date().toISOString()) // Can be null for lifetime or just check logic later
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

    // Logic to determine active plan based on license validity
    const now = new Date()
    const isValid = license && (!license.expires_at || new Date(license.expires_at) > now)

    const currentPlan = isValid ? license.plan : 'free'
    const maxJobs = isValid ? license.max_jobs : 1

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
                <ServerSettingsForm server={server} />
            </div>
        </div>
    )
}


import { createClient } from "@/utils/supabase/server"
import { notFound, redirect } from "next/navigation"
import { LicenseForm } from "../settings/license/license-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function LicensePage(props: { params: Promise<{ serverId: string }> }) {
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
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

    // Logic to determine active plan
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
                    <h1 className="text-2xl font-bold">Abonnement & Licence</h1>
                    <p className="text-sm text-muted-foreground">Gérez votre plan et accédez aux fonctionnalités Premium.</p>
                </div>
            </div>

            <LicenseForm serverId={serverId} currentPlan={currentPlan} maxJobs={maxJobs} />

            {/* Optional: Add comparison table or feature list here later */}
        </div>
    )
}

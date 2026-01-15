
import { createClient } from "@/utils/supabase/server"
import { notFound, redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Kanban, BarChart3 } from "lucide-react"
import Link from "next/link"

export default async function ApplicationsPage(props: { params: Promise<{ serverId: string }> }) {
    const params = await props.params;
    const { serverId } = params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    // Fetch Server Details
    const { data: server } = await supabase
        .from('servers')
        .select('*')
        .eq('id', serverId)
        .single()

    if (!server) return notFound()

    // Fetch Jobs with Application Counts
    const { data: jobs } = await supabase
        .from('jobs')
        .select('*, applications(count)')
        .eq('server_id', serverId)
        .order('created_at', { ascending: false })

    // Calculate Global Stats
    const totalApplications = jobs?.reduce((acc, job) => acc + ((job.applications as any)?.[0]?.count || 0), 0) || 0
    const activeJobs = jobs?.filter(j => j.is_open).length || 0

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Candidatures</h1>
                <p className="text-muted-foreground">Gérez les processus de recrutement de vos différents postes.</p>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Candidatures</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalApplications}</div>
                        <p className="text-xs text-muted-foreground">Tous postes confondus</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Postes Actifs</CardTitle>
                        <Kanban className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeJobs}</div>
                        <p className="text-xs text-muted-foreground">Sur {jobs?.length || 0} créés</p>
                    </CardContent>
                </Card>
            </div>

            {/* Job List */}
            <h2 className="text-xl font-semibold mt-4">Tableaux de Recrutement</h2>

            {jobs && jobs.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {jobs.map((job) => (
                        <Card key={job.id} className="group hover:border-blue-500/50 transition-colors">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle>{job.title}</CardTitle>
                                    {job.is_open ? (
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Ouvert</span>
                                    ) : (
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Fermé</span>
                                    )}
                                </div>
                                <CardDescription>
                                    {(job.applications as any)?.[0]?.count || 0} candidatures reçues
                                </CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <Link href={`/dashboard/server/${serverId}/job/${job.id}/kanban`} className="w-full">
                                    <Button className="w-full group-hover:bg-blue-600 transition-colors">
                                        Voir le tableau
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-xl">
                    <p className="text-muted-foreground">Aucun poste n'a été créé.</p>
                    <Link href={`/dashboard/server/${serverId}`}>
                        <Button variant="link">Créer un premier poste</Button>
                    </Link>
                </div>
            )}
        </div>
    )
}


import { createClient } from "@/utils/supabase/server"
import { checkPermission } from "@/utils/permissions"
import { notFound, redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createPortalSession } from "@/utils/stripe/actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ArrowLeft, Plus, FileText, Settings, Users, Briefcase, ArrowRight, Activity, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { EditJobForm } from "./components/edit-job-form"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreateJobForm } from "./components/create-job-form"

// We need to define params type for Page
export default async function ServerPage(props: { params: Promise<{ serverId: string }> }) {
    const params = await props.params;
    const { serverId } = params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    // Fetch Server Details
    const { data: server, error: serverError } = await supabase
        .from('servers')
        .select('*')
        .eq('id', serverId)
        .single()

    if (serverError || !server) {
        return notFound()
    }

    // Fetch Jobs with Application Count
    const { data: jobs } = await supabase
        .from('jobs')
        .select('*, applications(count)')
        .eq('server_id', serverId)
        .order('created_at', { ascending: false })

    // Fetch Member to check for job restrictions
    const { data: member } = await supabase
        .from('server_members')
        .select('job_id')
        .eq('server_id', serverId)
        .eq('user_id', user.id)
        .maybeSingle()

    // Filter jobs if member has a restriction
    let displayedJobs = jobs;
    if (member?.job_id) {
        displayedJobs = jobs?.filter(job => job.id === member.job_id) || [];
    }

    // Check Permissions
    const canCreateJobs = await checkPermission(serverId, 'can_create_jobs')
    const canEditJobs = await checkPermission(serverId, 'can_edit_jobs')
    const canManageTeam = await checkPermission(serverId, 'can_manage_team')
    const canEditServer = await checkPermission(serverId, 'can_edit_server')



    // ... (keep props and data fetching logic same until return)

    // Calculate Stats
    const totalJobs = jobs?.length || 0
    // const activeJobs = jobs?.filter(j => j.is_open).length || 0 // Unused in new UI
    const totalApplications = jobs?.reduce((acc, job) => acc + ((job.applications as any)?.[0]?.count || 0), 0) || 0

    // Fetch Subscription Status for UI
    const { checkSubscriptionStatus } = await import("@/utils/subscription")
    const { plan } = await checkSubscriptionStatus()

    const limits = {
        'free': 1,
        'standard': 5,
        'premium': Infinity
    }
    const currentLimit = limits[plan as keyof typeof limits] || 1
    const planName = plan === 'premium' ? 'Premium' : (plan === 'standard' ? 'Standard' : 'Gratuit')
    const percentage = currentLimit === Infinity ? 0 : (totalJobs / currentLimit) * 100

    return (
        <div className="space-y-8 pb-10">
            {/* Extended Header */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Link href="/dashboard" className="hover:text-primary transition-colors">Serveurs</Link>
                            <span className="text-gray-300">/</span>
                            <span>{server.name}</span>
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">{server.name}</h1>
                        <p className="text-muted-foreground max-w-lg">
                            Gérez les recrutements, les membres et les paramètres de votre serveur.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {canManageTeam && (
                            <Link href={`/dashboard/server/${serverId}/team`}>
                                <Button variant="outline" className="shadow-sm">
                                    <Users className="mr-2 h-4 w-4" />
                                    Équipe
                                </Button>
                            </Link>
                        )}
                        {canEditServer && (
                            <Link href={`/dashboard/server/${serverId}/settings`}>
                                <Button variant="outline" className="shadow-sm">
                                    <Settings className="mr-2 h-4 w-4" />
                                    Paramètres
                                </Button>
                            </Link>
                        )}
                        <Link href={`/server/${server.slug}`} target="_blank">
                            <Button className="shadow-sm bg-gray-900 text-white hover:bg-gray-800">
                                Voir la page publique
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="shadow-sm border-l-4 border-l-blue-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Postes & Abonnement</CardTitle>
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalJobs} / {currentLimit === Infinity ? '∞' : currentLimit}</div>
                            <div className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
                                <span>Plan {planName}</span>
                                {percentage >= 100 && <span className="text-red-500 font-semibold">Max atteint</span>}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 mb-3">
                                <div
                                    className={`bg-blue-600 h-1.5 rounded-full ${percentage >= 100 ? 'bg-red-500' : ''}`}
                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                ></div>
                            </div>

                            <form action={createPortalSession}>
                                <Button variant="outline" size="sm" className="w-full text-xs h-7">
                                    Gérer l'abonnement
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-l-4 border-l-purple-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Candidatures Totales</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalApplications}</div>
                            <p className="text-xs text-muted-foreground">Reçues sur tous les postes</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-l-4 border-l-green-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Taux de réponse</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">100%</div>
                            <p className="text-xs text-muted-foreground">Délai moyen: 2h</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Separator />

            {/* Jobs Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Vos Postes</h2>
                        <p className="text-muted-foreground text-sm">Gérez les fiches de postes et les réponses.</p>
                    </div>
                    {canCreateJobs && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button size="lg" className="shadow-md bg-blue-600 hover:bg-blue-700">
                                    <Plus className="mr-2 h-5 w-5" />
                                    Nouveau Poste
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Créer un nouveau poste</DialogTitle>
                                    <DialogDescription>
                                        Ajoutez un rôle pour lequel vous recrutez (ex: Policier, Ambulancier).
                                    </DialogDescription>
                                </DialogHeader>
                                <CreateJobForm serverId={serverId} />
                            </DialogContent>
                        </Dialog>
                    )}
                </div>

                {displayedJobs && displayedJobs.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {displayedJobs.map((job) => (
                            <Card key={job.id} className="group hover:shadow-lg transition-all duration-300 border-gray-200 overflow-hidden flex flex-col">
                                <CardHeader className="bg-gray-50/50 pb-4 border-b flex-1">
                                    <div className="flex justify-between items-start gap-4 mb-2">
                                        <div className="flex flex-col gap-1">
                                            <CardTitle className="text-xl font-bold text-gray-900 line-clamp-1">{job.title}</CardTitle>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-[10px] bg-white text-gray-500 border-gray-200 shadow-sm">
                                                    {job.contract_type || 'Temps plein'}
                                                </Badge>
                                                {job.whitelist_required && (
                                                    <Badge variant="secondary" className="text-[10px] bg-purple-100 text-purple-700 border-purple-200">
                                                        Whitelist
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        {/* Status Badge */}
                                        <Badge variant={job.is_open ? "default" : "secondary"} className={`${job.is_open ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500'} border-0`}>
                                            {job.is_open ? 'Ouvert' : 'Fermé'}
                                        </Badge>
                                    </div>
                                    <CardDescription className="line-clamp-3 mt-2 text-sm leading-relaxed">
                                        {job.description || "Aucune description fournie pour ce poste."}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6 pb-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-3xl font-bold text-gray-900">{(job.applications as any)?.[0]?.count || 0}</span>
                                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Candidats</span>
                                        </div>
                                        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                            <JobIconName name={job.icon} />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-4 bg-gray-50/30 flex gap-3">
                                    {canEditJobs && (
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="icon" className="shrink-0" title="Configurer le poste">
                                                    <Settings className="h-4 w-4 text-gray-500" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[500px]">
                                                <DialogHeader>
                                                    <DialogTitle>Modifier le poste</DialogTitle>
                                                    <DialogDescription>
                                                        Modifiez les informations générales de l'offre.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <EditJobForm job={job} serverId={serverId} />
                                            </DialogContent>
                                        </Dialog>
                                    )}

                                    <Link href={`/dashboard/server/${serverId}/job/${job.id}/builder`} className="flex-1">
                                        <Button variant="outline" className="w-full bg-white hover:bg-gray-50 text-gray-700 border-gray-200">
                                            <FileText className="mr-2 h-4 w-4" />
                                            Questions
                                        </Button>
                                    </Link>
                                    <Link href={`/dashboard/server/${serverId}/job/${job.id}/kanban`} className="flex-1">
                                        <Button className="w-full bg-gray-900 group-hover:bg-blue-600 transition-colors text-white shadow-sm">
                                            Voir tout
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed rounded-xl bg-gray-50/50">
                        <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Briefcase className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Aucun poste créé</h3>
                        <p className="text-muted-foreground text-center max-w-sm mt-2 mb-6">
                            Commencez par créer votre premier poste de recrutement pour recevoir des candidatures.
                        </p>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Créer un poste
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Créer un nouveau poste</DialogTitle>
                                    <DialogDescription>
                                        Ajoutez un rôle pour lequel vous recrutez.
                                    </DialogDescription>
                                </DialogHeader>
                                <CreateJobForm serverId={serverId} />
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
            </div>
        </div>
    )
}

function FilesIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 7h-3a2 2 0 0 1-2-2V2" />
            <path d="M9 18a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4l6 6v7a2 2 0 0 1-2 2Z" />
        </svg>
    )
}

function JobIconName({ name }: { name?: string }) {
    switch (name) {
        case 'Shield': return <Shield className="h-5 w-5" />
        case 'Stethoscope': return <Activity className="h-5 w-5" /> // Proxy for medical if not exact
        case 'Car': return <Briefcase className="h-5 w-5" /> // Car icon not imported, fallback
        case 'Gavel': return <Briefcase className="h-5 w-5" /> // Fallback
        default: return <Briefcase className="h-5 w-5" />
    }
}

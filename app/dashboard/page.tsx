
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { PlusCircle, Server, Users, FileText, ArrowRight } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"

import { ServerCardImage } from "./components/server-card-image"

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch servers owned by the user or where they are a member
    // 1. Fetch servers owned by usage
    // 2. Fetch servers where user is a member

    // Get servers where I am a member
    const { data: memberships } = await supabase
        .from('server_members')
        .select('server_id, role')
        .eq('user_id', user?.id)

    const memberServerIds = memberships?.map(m => m.server_id) || []

    // Create a map of roles for easier lookup
    const roleMap = new Map();
    memberships?.forEach(m => roleMap.set(m.server_id, m.role));

    // Fetch ALL relevant servers (Owned OR Member)
    const { data: allServers } = await supabase
        .from('servers')
        .select('*, jobs(id, applications(count))')
        .or(`owner_id.eq.${user?.id},id.in.(${memberServerIds.join(',') || '00000000-0000-0000-0000-000000000000'})`)
        .order('created_at', { ascending: false })

    // Helper to process servers with roles and counts
    const validServers = allServers?.map(server => ({
        ...server,
        userRole: server.owner_id === user?.id ? 'owner' : roleMap.get(server.id) || 'viewer',
        jobsCount: server.jobs?.length || 0,
        applicationsCount: server.jobs?.reduce((acc: number, job: any) => acc + (job.applications?.[0]?.count || 0), 0) || 0
    })) || []

    const hasServers = validServers && validServers.length > 0;

    // ... imports
    // (keep imports same)

    // ... server logic same until return

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Vue d'ensemble</h1>
                    <p className="text-muted-foreground mt-1">Bienvenue sur votre espace de gestion.</p>
                </div>
                {hasServers && (
                    <Link href="/dashboard/servers/new">
                        <Button className="bg-gray-900 text-white hover:bg-gray-800 shadow-sm rounded-lg">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Nouveau Serveur
                        </Button>
                    </Link>
                )}
            </div>

            {validServers.length === 0 ? (
                <Card className="border-dashed shadow-sm">
                    <CardHeader className="text-center pb-10 pt-10">
                        <div className="mx-auto bg-gray-50 rounded-full h-20 w-20 flex items-center justify-center mb-6">
                            <Server className="h-10 w-10 text-gray-400" />
                        </div>
                        <CardTitle className="text-xl">Aucun serveur configuré</CardTitle>
                        <CardDescription className="max-w-md mx-auto mt-2 text-base">
                            Vous n'avez pas encore configuré de serveur FiveM. Créez votre premier espace pour commencer à recruter.
                        </CardDescription>
                        <div className="pt-8">
                            <Link href="/dashboard/servers/new">
                                <Button size="lg" className="bg-gray-900 text-white hover:bg-gray-800 shadow-sm">
                                    <PlusCircle className="mr-2 h-5 w-5" />
                                    Créer un serveur
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {validServers.map((server) => (
                        <Card key={server.id} className="group overflow-hidden transition-all duration-300 hover:shadow-xl border-gray-200 bg-white flex flex-col">
                            <div className="h-40 w-full bg-gray-900 relative overflow-hidden">
                                {/* Image Overlay for Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-60" />
                                <ServerCardImage src={server.cover_image_url} alt={server.name} />

                                <div className="absolute top-3 right-3 z-20">
                                    <span className="px-3 py-1 bg-white text-gray-900 rounded-md text-[10px] font-bold uppercase tracking-wide shadow-sm">
                                        {server.userRole === 'viewer' ? 'Observateur' :
                                            server.userRole === 'manager' ? 'Manager' :
                                                server.owner_id === user?.id ? 'Propriétaire' : server.userRole || 'Admin'}
                                    </span>
                                </div>
                            </div>

                            <CardHeader className="pb-3 pt-5">
                                <CardTitle className="text-xl font-bold text-gray-900 line-clamp-1">
                                    {server.name}
                                </CardTitle>
                                <CardDescription className="line-clamp-2 text-sm mt-1 h-10">
                                    {server.description || "Aucune description."}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="pb-6">
                                <div className="flex gap-6 text-sm font-medium text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-gray-400" />
                                        <span>{server.jobsCount} Jobs</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-gray-400" />
                                        <span>{server.applicationsCount} Candidats</span>
                                    </div>
                                </div>
                            </CardContent>

                            <div className="mt-auto border-t border-gray-100 p-2">
                                <Link href={`/dashboard/server/${server.id}`} className="block">
                                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group/btn cursor-pointer">
                                        <span className="text-sm font-semibold text-gray-900 pl-1">Gérer</span>
                                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover/btn:text-gray-900 group-hover/btn:translate-x-1 transition-all" />
                                    </div>
                                </Link>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}


import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Monitor, MapPin, ShieldCheck, ArrowRight, Users, Sparkles, Briefcase, Activity } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Metadata } from "next"

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const params = await props.params;
    const { slug } = params
    const supabase = await createClient()

    const { data: server } = await supabase.from('servers').select('name, description, cover_image_url').eq('slug', slug).single()

    if (!server) {
        return {
            title: 'Serveur Introuvable - FiveRecruit',
            description: "Ce serveur n'existe pas ou a été supprimé."
        }
    }

    return {
        title: `${server.name} - Recrutement`,
        description: server.description || `Postulez dès maintenant sur ${server.name} via FiveRecruit.`,
        openGraph: {
            title: `${server.name} recrute !`,
            description: server.description || "Rejoignez l'aventure.",
            images: server.cover_image_url ? [server.cover_image_url] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${server.name} - Recrutement`,
            description: server.description || `Postulez dès maintenant sur ${server.name}.`,
            images: server.cover_image_url ? [server.cover_image_url] : [],
        }
    }
}

export default async function PublicServerPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const { slug } = params
    const supabase = await createClient()

    // Fetch Server by Slug
    const { data: server } = await supabase
        .from('servers')
        .select('*')
        .eq('slug', slug)
        .single()

    if (!server) return notFound()

    // Fetch Open Jobs
    const { data: jobs } = await supabase
        .from('jobs')
        .select('*')
        .eq('server_id', server.id)
        .eq('is_open', true)
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-indigo-500/30">
            {/* Ambient Background Glow */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-[120px]" />
            </div>

            {/* Navbar Overlay */}
            <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/50 backdrop-blur-xl">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <span className="font-bold text-lg text-white">F</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white hidden md:block">FiveRecruit</span>
                    </div>
                    <Link href="/login">
                        <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10 rounded-full px-6 transition-all duration-300">
                            Espace Staff
                        </Button>
                    </Link>
                </div>
            </nav>

            <main className="relative z-10 pt-32 pb-20">
                {/* Hero Section */}
                <div className="container mx-auto px-6">
                    <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-zinc-900/50 shadow-2xl shadow-black/50">
                        {/* Hero Background Image */}
                        <div className="absolute inset-0 z-0">
                            {server.cover_image_url ? (
                                <img
                                    src={server.cover_image_url}
                                    alt={server.name}
                                    className="w-full h-full object-cover opacity-60 scale-105 hover:scale-100 transition-transform duration-[2s]"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-black opacity-50" />
                            )}
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/90 via-[#0a0a0a]/40 to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 p-8 md:p-16 lg:p-20 max-w-4xl">
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <Badge className="bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full backdrop-blur-md">
                                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                    Recrutement Ouvert
                                </Badge>
                                <Badge className="bg-white/5 text-gray-300 border border-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                                    <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
                                    Vérifié
                                </Badge>
                                <Badge className="bg-white/5 text-gray-300 border border-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                                    <MapPin className="mr-1.5 h-3.5 w-3.5" />
                                    France
                                </Badge>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 drop-shadow-lg">
                                {server.name}
                            </h1>

                            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-10 max-w-2xl drop-shadow-md">
                                {server.description || "Rejoignez une aventure unique. Découvrez nos opportunités de carrière et intégrez une équipe passionnée."}
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Button size="lg" className="rounded-full h-14 px-8 text-lg font-semibold bg-white text-black hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] border-0">
                                    Voir les postes
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                                {server.discord_invite_url && (
                                    <Link href={server.discord_invite_url} target="_blank">
                                        <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-lg font-medium border-white/20 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 hover:border-white/40 transition-all">
                                            Rejoindre Discord
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Jobs Section */}
                <div className="container mx-auto px-6 mt-24">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-3xl font-bold flex items-center gap-3">
                                <Briefcase className="h-8 w-8 text-indigo-500" />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                    Postes Disponibles
                                </span>
                            </h2>
                            <p className="text-gray-400 mt-2">Rejoignez nos rangs et commencez votre histoire.</p>
                        </div>
                        <Badge className="hidden md:flex bg-white/5 border-white/10 text-gray-400 px-4 py-2 rounded-full text-base">
                            {jobs?.length || 0} offres
                        </Badge>
                    </div>

                    {jobs && jobs.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {jobs.map((job) => (
                                <Link key={job.id} href={`/server/${slug}/apply/${job.id}`} className="group">
                                    <div className="relative h-full bg-[#111111] border border-white/10 rounded-3xl p-6 hover:border-indigo-500/50 hover:bg-[#161616] transition-all duration-300 group-hover:shadow-[0_0_40px_rgba(99,102,241,0.1)] flex flex-col">

                                        <div className="flex justify-between items-start mb-6">
                                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <JobIconName name={job.icon} className="h-5 w-5 text-gray-400 group-hover:text-indigo-400 transition-colors" />
                                            </div>
                                            <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                                {job.contract_type || 'Temps plein'}
                                            </Badge>
                                        </div>

                                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                                            {job.title}
                                        </h3>

                                        <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow line-clamp-3">
                                            {job.description || "Ce poste nécessite une grande motivation et un engagement sérieux. Cliquez pour en savoir plus."}
                                        </p>

                                        <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                {job.whitelist_required ? (
                                                    <>
                                                        <Users className="h-4 w-4" />
                                                        <span>Whitelist requise</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Users className="h-4 w-4" />
                                                        <span>Ouvert à tous</span>
                                                    </>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm font-semibold text-white group-hover:translate-x-2 transition-transform duration-300">
                                                Postuler
                                                <ArrowRight className="h-4 w-4 text-indigo-400" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-[2.5rem] bg-[#111111] border border-white/10 p-20 text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
                            <div className="relative z-10">
                                <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Briefcase className="h-10 w-10 text-gray-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Aucun poste pour le moment</h3>
                                <p className="text-gray-400 max-w-md mx-auto">
                                    L'équipe est actuellement au complet. Revenez plus tard ou rejoignez notre Discord pour être informé des futurs recrutements.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

function JobIconName({ name, className }: { name?: string, className?: string }) {
    switch (name) {
        case 'Shield': return <ShieldCheck className={className} />
        case 'Stethoscope': return <Activity className={className} />
        case 'Car': return <Briefcase className={className} />
        case 'Gavel': return <Briefcase className={className} />
        default: return <Briefcase className={className} />
    }
}

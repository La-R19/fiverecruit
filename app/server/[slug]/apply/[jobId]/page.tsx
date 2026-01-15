
import { createClient } from "@/utils/supabase/server"
import { notFound, redirect } from "next/navigation"
import { PublicApplicationForm } from "./public-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function ApplyPage(props: { params: Promise<{ slug: string; jobId: string }> }) {
    const params = await props.params;
    const { slug, jobId } = params
    const supabase = await createClient()

    const { data: job } = await supabase
        .from('jobs')
        .select('*, servers(*)')
        .eq('id', jobId)
        .single()

    if (!job) notFound()

    // We also need profile to pre-fill or check auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        // Redirect to login with return url
        // For MVP we force login.
        // We can add a "Login to apply" screen.
        return (
            <div className="flex h-screen items-center justify-center flex-col gap-4">
                <h1 className="text-2xl font-bold">Connexion requise</h1>
                <p>Vous devez être connecté avec Discord pour postuler.</p>
                <Link href={`/login?next=/server/${slug}/apply/${jobId}`}>
                    <Button>Se connecter</Button>
                </Link>
            </div>
        )
    }

    // Check if already applied? (Optional for MVP)

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto space-y-8">
                <Link href={`/server/${slug}`} className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour au serveur
                </Link>

                <div className="space-y-4">
                    <div>
                        <h1 className="text-3xl font-bold">Postuler: {job.title}</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-600">
                                {job.contract_type || 'Temps plein'}
                            </div>
                            {job.whitelist_required && (
                                <div className="text-sm bg-purple-100 px-2 py-1 rounded text-purple-700">
                                    Whitelist requise
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {job.description || "Aucune description disponible."}
                    </div>

                    <p className="text-muted-foreground">Remplissez le formulaire ci-dessous pour soumettre votre candidature.</p>
                </div>

                <div className="bg-white rounded-3xl shadow-sm p-8 border">
                    <PublicApplicationForm
                        jobId={job.id}
                        schema={job.form_schema || []}
                        userId={user.id}
                    />
                </div>
            </div>
        </div>
    )
}

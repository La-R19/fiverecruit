
import { createClient } from "@/utils/supabase/server"
import { notFound, redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"

export default async function InvitePage(props: { params: Promise<{ code: string }> }) {
    const params = await props.params;
    const { code } = params
    const supabase = await createClient()

    // Fetch Invite & Server info
    const { data: invite } = await supabase
        .from('server_invites')
        .select('*, servers(*)')
        .eq('code', code)
        .single()

    if (!invite) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <div className="mx-auto bg-red-100 p-3 rounded-full w-fit mb-4">
                            <XCircle className="h-8 w-8 text-red-500" />
                        </div>
                        <CardTitle>Invitation Invalide</CardTitle>
                        <CardDescription>Ce lien d'invitation n'existe pas ou a expiré.</CardDescription>
                    </CardHeader>
                    <CardFooter className="justify-center">
                        <Link href="/">
                            <Button variant="outline">Retour à l'accueil</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    const server = invite.servers as any

    // Handle Join
    async function acceptInvite() {
        "use server"
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return redirect('/login')

        const { data, error } = await supabase.rpc('join_server_with_invite', {
            invite_code: code
        })

        if (error) {
            console.error("Join error:", error)
            // In a real app we'd show a toast, but for now redirect or just log
            return
        }

        if (data && data.success) {
            redirect(`/dashboard/server/${data.server_id}`)
        } else {
            console.error("Join failed:", data?.error)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md text-center shadow-lg relative overflow-visible">
                <div className="h-32 w-full bg-gray-200 rounded-t-xl relative overflow-hidden">
                    {server.cover_image_url ? (
                        <img
                            src={server.cover_image_url}
                            alt={server.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-600" />
                    )}
                </div>

                <div className="absolute top-24 left-1/2 -translate-x-1/2">
                    <div className="h-16 w-16 bg-white rounded-xl shadow-md p-1 flex items-center justify-center border-4 border-white">
                        <span className="font-bold text-2xl text-black">
                            {server.name?.[0].toUpperCase()}
                        </span>
                    </div>
                </div>

                <CardHeader className="pt-10">
                    <CardTitle>Rejoindre {server.name}</CardTitle>
                    <CardDescription>
                        Vous avez été invité à rejoindre l'équipe de ce serveur en tant que <strong>{invite.role}</strong>.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form action={acceptInvite}>
                        <Button className="w-full py-6 text-lg" size="lg">
                            Accepter l'invitation
                        </Button>
                    </form>
                    <p className="text-xs text-muted-foreground">
                        En rejoignant, vous aurez accès au tableau de bord de ce serveur.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

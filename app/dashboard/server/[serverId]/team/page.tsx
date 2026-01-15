
import { createClient } from "@/utils/supabase/server"
import { notFound, redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Trash2, Copy, UserPlus, Shield, User, Settings } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createInvite, deleteInvite, removeMember } from "./actions"
import { headers } from "next/headers"

export default async function TeamPage(props: { params: Promise<{ serverId: string }> }) {
    const params = await props.params;
    const { serverId } = params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Fetch Server data
    const { data: server } = await supabase.from('servers').select('*').eq('id', serverId).single()
    if (!server) notFound()

    // Fetch Members
    const { data: members } = await supabase
        .from('server_members')
        .select('*, profiles(*)')
        .eq('server_id', serverId)

    // Fetch Active Invites
    const { data: invites } = await supabase
        .from('server_invites')
        .select('*')
        .eq('server_id', serverId)

    // Helper Action Wrappers
    async function onCreateInvite() {
        "use server"
        await createInvite(serverId, 'manager')
    }

    async function onDeleteInvite(id: string) {
        "use server"
        await deleteInvite(id, serverId)
    }

    async function onRemoveMember(id: string) {
        "use server"
        await removeMember(id, serverId)
    }

    // Get host for copy link
    const headersList = await headers()
    const host = headersList.get('host') || 'localhost:3000'
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href={`/dashboard/server/${serverId}`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Gestion de l'équipe</h1>
                    <p className="text-sm text-muted-foreground">Invitez vos collaborateurs à gérer ce serveur.</p>
                </div>
            </div>

            <div className="grid gap-8">
                {/* Invites Section */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Invitations en attente</CardTitle>
                                <CardDescription>Générez un lien pour inviter un membre (Rôle: Manager par défaut).</CardDescription>
                            </div>
                            <form action={onCreateInvite}>
                                <Button size="sm">
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Générer un lien
                                </Button>
                            </form>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {invites && invites.length > 0 ? (
                            <div className="space-y-4">
                                {invites.map((invite) => (
                                    <div key={invite.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                                        <div className="flex items-center gap-3 overflow-hidden flex-1">
                                            <div className="bg-white p-2 rounded border">
                                                <code className="text-xs">{invite.code}</code>
                                            </div>
                                            <span className="text-xs text-muted-foreground truncate">
                                                {protocol}://{host}/invite/{invite.code}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {/* We can add a simple client Copy button later, for now select & copy */}
                                            <form action={onDeleteInvite.bind(null, invite.id)}>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </form>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground italic">Aucune invitation active.</p>
                        )}
                    </CardContent>
                </Card>

                {/* Members Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Membres</CardTitle>
                        <CardDescription>Liste des personnes ayant accès à ce serveur.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Owner */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarFallback>O</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium text-sm">Propriétaire</p>
                                        <p className="text-xs text-muted-foreground">Admin Suprême</p>
                                    </div>
                                </div>
                                <Shield className="h-4 w-4 text-yellow-500" />
                            </div>

                            {members?.map((member) => (
                                <div key={member.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={member.profiles?.avatar_url} />
                                            <AvatarFallback>{member.profiles?.username?.[0] || 'M'}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-sm">{member.profiles?.username || 'Utilisateur inconnu'}</p>
                                            <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {(server.owner_id === user.id && member.user_id !== user.id) && (
                                            <Link href={`/dashboard/server/${serverId}/team/member/${member.id}`}>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500 hover:text-black">
                                                    <Settings className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        )}
                                        <form action={onRemoveMember.bind(null, member.id)}>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-50">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </form>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

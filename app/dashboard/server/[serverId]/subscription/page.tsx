
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle, Plus, Unplug, Crown } from "lucide-react"
import { assignSubscription, unassignSubscription } from "./actions"
import Link from "next/link"
import { createPortalSession } from "@/utils/stripe/actions"

export default async function SubscriptionPage(props: { params: Promise<{ serverId: string }> }) {
    const params = await props.params;
    const { serverId } = params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    // 1. Get Current Server Subscription
    const { data: currentSub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('server_id', serverId)
        .in('status', ['active', 'trialing'])
        .maybeSingle()

    // 2. Get User's Available (Unassigned) Subscriptions
    const { data: availableSubs } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .is('server_id', null)
        .in('status', ['active', 'trialing'])

    // 3. Get User's OTHER assigned subscriptions (just for info?) - Optional

    const isPremium = (priceId: string) => priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Abonnement du Serveur</h3>
                <p className="text-sm text-muted-foreground">
                    Gérez la licence active pour ce serveur.
                </p>
            </div>

            {/* Current Active Subscription */}
            {currentSub ? (
                <Card className="border-green-200 bg-green-50/50">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                <CardTitle>Licence Active</CardTitle>
                            </div>
                            <Badge className="bg-green-600">
                                {isPremium(currentSub.price_id) ? 'Premium' : 'Standard'}
                            </Badge>
                        </div>
                        <CardDescription>
                            Ce serveur bénéficie des avantages de votre abonnement.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-gray-600">
                            ID: <span className="font-mono">{currentSub.id.slice(0, 12)}...</span>
                        </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                        <form action={unassignSubscription.bind(null, serverId, currentSub.id)}>
                            <Button variant="outline" className="bg-white hover:bg-red-50 hover:text-red-600 border-red-200">
                                <Unplug className="mr-2 h-4 w-4" />
                                Détacher
                            </Button>
                        </form>
                        <form action={createPortalSession}>
                            <Button variant="outline">
                                Gérer la facturation
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            ) : (
                <Card className="border-dashed border-2">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-yellow-600" />
                            <CardTitle>Aucune licence active</CardTitle>
                        </div>
                        <CardDescription>
                            Ce serveur est actuellement sur le **Plan Gratuit** (1 poste max).
                        </CardDescription>
                    </CardHeader>
                    {availableSubs && availableSubs.length > 0 && (
                        <CardContent className="space-y-4">
                            <p className="text-sm font-medium">Vos licences disponibles :</p>
                            <div className="grid gap-2">
                                {availableSubs.map(sub => (
                                    <div key={sub.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                                        <div className="flex items-center gap-2">
                                            <Crown className={`h-4 w-4 ${isPremium(sub.price_id) ? 'text-purple-600' : 'text-blue-600'}`} />
                                            <span className="font-medium">
                                                {isPremium(sub.price_id) ? 'Premium' : 'Standard'}
                                            </span>
                                            <span className="text-xs text-muted-foreground font-mono">
                                                ({sub.id.slice(-4)})
                                            </span>
                                        </div>
                                        <form action={assignSubscription.bind(null, serverId, sub.id)}>
                                            <Button size="sm">Activer ici</Button>
                                        </form>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    )}
                    <CardFooter>
                        {(!availableSubs || availableSubs.length === 0) && (
                            <Link href="/pricing">
                                <Button className="w-full sm:w-auto">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Acheter une nouvelle licence
                                </Button>
                            </Link>
                        )}
                    </CardFooter>
                </Card>
            )}
        </div>
    )
}

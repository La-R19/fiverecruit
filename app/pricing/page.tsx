
import { Button } from "@/components/ui/button"
import { Check, Star, Zap, Shield, Crown } from "lucide-react"
import { createCheckoutSession } from "@/utils/stripe/actions"
import { Navbar } from "@/components/layout/Navbar"
import { createClient } from "@/utils/supabase/server"
import Link from "next/link"

export default async function PricingPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const standardPrice = process.env.NEXT_PUBLIC_STRIPE_PRICE_STANDARD!
    const premiumPrice = process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM!

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-black selection:text-white overflow-x-hidden">
            <Navbar />

            {/* Subtle Background Pattern */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
                style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
            </div>

            <div className="container relative z-10 mx-auto px-6 pt-32 pb-24">
                <div className="text-center mb-24 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 text-xs font-bold uppercase tracking-widest text-gray-600 mb-8 border border-black/5">
                        <Star className="h-3 w-3 fill-black text-black" />
                        Investissez dans la qualité
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-black mb-8 leading-[1.05]">
                        TARIFS <span className="text-gray-300">TRANSPARENTS.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-500 font-medium leading-relaxed">
                        Des outils professionnels pour les communautés qui exigent l'excellence.
                        <br className="hidden md:block" /> Aucun frais caché. Annulable à tout moment.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto px-4 md:px-0">
                    {/* STANDARD PLAN */}
                    <div className="bg-white rounded-[2.5rem] p-10 border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative group">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gray-100 group-hover:bg-gray-200 transition-colors"></div>

                        <div className="mb-8">
                            <h3 className="text-3xl font-bold mb-2">Standard</h3>
                            <p className="text-gray-500 font-medium text-lg">L'essentiel pour démarrer.</p>
                        </div>

                        <div className="mb-10 flex items-baseline border-b border-gray-100 pb-10">
                            <span className="text-6xl font-black tracking-tighter">9.90€</span>
                            <span className="ml-2 text-gray-500 font-bold text-lg">/mois</span>
                        </div>

                        <ul className="space-y-6 flex-1 mb-10">
                            <li className="flex items-start gap-4">
                                <div className="mt-1 h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                    <Check className="h-3.5 w-3.5 text-black font-bold" />
                                </div>
                                <span className="text-lg font-medium text-gray-700">Jusqu'à <span className="text-black font-bold">5 offres d'emploi</span></span>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="mt-1 h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                    <Check className="h-3.5 w-3.5 text-black font-bold" />
                                </div>
                                <span className="text-lg font-medium text-gray-700">Candidatures <span className="text-black font-bold">Illimitées</span></span>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="mt-1 h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                    <Check className="h-3.5 w-3.5 text-black font-bold" />
                                </div>
                                <span className="text-lg font-medium text-gray-700">Dashboard Gestionnaire</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="mt-1 h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                    <Check className="h-3.5 w-3.5 text-black font-bold" />
                                </div>
                                <span className="text-lg font-medium text-gray-700">Support par email</span>
                            </li>
                        </ul>

                        <div className="mt-auto">
                            {user ? (
                                <form action={createCheckoutSession.bind(null, standardPrice)}>
                                    <Button className="w-full h-16 rounded-2xl bg-gray-50 text-black hover:bg-gray-100 border border-gray-200 text-lg font-bold tracking-wide transition-all shadow-sm hover:shadow-md">
                                        Choisir Standard
                                    </Button>
                                </form>
                            ) : (
                                <Link href="/login?next=/pricing">
                                    <Button className="w-full h-16 rounded-2xl bg-gray-50 text-black hover:bg-gray-100 border border-gray-200 text-lg font-bold tracking-wide transition-all shadow-sm hover:shadow-md">
                                        Se connecter
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* PREMIUM PLAN */}
                    <div className="bg-black text-white rounded-[2.5rem] p-10 border border-black shadow-2xl overflow-hidden relative flex flex-col transform md:scale-105 hover:scale-[1.07] transition-transform duration-500 z-10">
                        {/* Blob Effect */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gray-800 rounded-full blur-[80px] opacity-40 mix-blend-screen pointer-events-none"></div>

                        <div className="absolute top-0 right-0 bg-white text-black text-xs font-bold px-6 py-3 rounded-bl-3xl uppercase tracking-widest border-l border-b border-gray-200">
                            Populaire
                        </div>

                        <div className="mb-8 relative">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-3xl font-bold">Premium</h3>
                                <Crown className="h-6 w-6 text-yellow-400 fill-yellow-400 animate-pulse" />
                            </div>
                            <p className="text-gray-400 font-medium text-lg">L'expérience ultime.</p>
                        </div>

                        <div className="mb-10 flex items-baseline border-b border-gray-800 pb-10 relative">
                            <span className="text-6xl font-black tracking-tighter text-white">19.90€</span>
                            <span className="ml-2 text-gray-500 font-bold text-lg">/mois</span>
                        </div>

                        <ul className="space-y-6 flex-1 mb-10 relative">
                            <li className="flex items-start gap-4">
                                <div className="mt-1 h-6 w-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                                    <Check className="h-3.5 w-3.5 text-white font-bold" />
                                </div>
                                <span className="text-lg font-medium text-gray-300">Offres d'emploi <span className="text-white font-bold border-b border-white/30">ILLIMITÉES</span></span>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="mt-1 h-6 w-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                                    <Check className="h-3.5 w-3.5 text-white font-bold" />
                                </div>
                                <span className="text-lg font-medium text-gray-300">Accès Prioritaire 24/7</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="mt-1 h-6 w-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                                    <Check className="h-3.5 w-3.5 text-white font-bold" />
                                </div>
                                <span className="text-lg font-medium text-gray-300">Fonctionnalités avancées (API)</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="mt-1 h-6 w-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                                    <Check className="h-3.5 w-3.5 text-white font-bold" />
                                </div>
                                <span className="text-lg font-medium text-gray-300">Badge "Serveur Vérifié"</span>
                            </li>
                        </ul>

                        <div className="mt-auto relative">
                            {user ? (
                                <form action={createCheckoutSession.bind(null, premiumPrice)}>
                                    <Button className="w-full h-16 rounded-2xl bg-white text-black hover:bg-gray-100 text-lg font-bold tracking-wide transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]">
                                        Passer Premium
                                    </Button>
                                </form>
                            ) : (
                                <Link href="/login?next=/pricing">
                                    <Button className="w-full h-16 rounded-2xl bg-white text-black hover:bg-gray-100 text-lg font-bold tracking-wide transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]">
                                        Se connecter
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Security Badge */}
                <div className="mt-20 flex justify-center animate-in fade-in slide-in-from-bottom-8 delay-500 duration-1000">
                    <div className="flex items-center gap-3 px-6 py-3 bg-gray-50 rounded-full border border-gray-100 text-gray-500 text-sm font-semibold">
                        <Shield className="h-4 w-4" />
                        Paiement sécurisé via Stripe. Aucune donnée bancaire stockée.
                    </div>
                </div>
            </div>
        </div>
    )
}

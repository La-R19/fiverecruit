
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
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
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <div className="container mx-auto px-4 py-24">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-4">
                        Tarifs simples et transparents
                    </h1>
                    <p className="text-xl text-slate-600">
                        Choisissez l'offre qui correspond à la taille de votre communauté.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* STANDARD PLAN */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 flex flex-col">
                        <div className="p-8 flex-1">
                            <h3 className="text-2xl font-bold text-slate-900">Standard</h3>
                            <p className="mt-4 text-slate-500">Pour les serveurs en croissance.</p>
                            <div className="mt-8 flex items-baseline">
                                <span className="text-5xl font-extrabold text-slate-900">9.90€</span>
                                <span className="ml-2 text-slate-500">/mois</span>
                            </div>

                            <ul className="mt-8 space-y-4">
                                <li className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-3" />
                                    <span>Jusqu'à 5 offres d'emploi</span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-3" />
                                    <span>Candidatures illimitées</span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-3" />
                                    <span>Dashboard Gestionnaire</span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-3" />
                                    <span>Bot Discord (Fonctions de base)</span>
                                </li>
                            </ul>
                        </div>
                        <div className="p-8 bg-slate-50 border-t border-slate-100">
                            {user ? (
                                <form action={createCheckoutSession.bind(null, standardPrice)}>
                                    <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 h-12 text-lg rounded-xl">
                                        Choisir Standard
                                    </Button>
                                </form>
                            ) : (
                                <Link href="/login?next=/pricing">
                                    <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 h-12 text-lg rounded-xl">
                                        Se connecter pour commander
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* PREMIUM PLAN */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-indigo-600 relative flex flex-col transform scale-105 z-10">
                        <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                            POPULAIRE
                        </div>
                        <div className="p-8 flex-1">
                            <h3 className="text-2xl font-bold text-indigo-600">Premium</h3>
                            <p className="mt-4 text-slate-500">Pour les grosses structures et l'automatisation.</p>
                            <div className="mt-8 flex items-baseline">
                                <span className="text-5xl font-extrabold text-slate-900">19.90€</span>
                                <span className="ml-2 text-slate-500">/mois</span>
                            </div>

                            <ul className="mt-8 space-y-4">
                                <li className="flex items-center">
                                    <Check className="h-5 w-5 text-indigo-600 mr-3" />
                                    <span className="font-semibold">Offres d'emploi illimitées</span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="h-5 w-5 text-indigo-600 mr-3" />
                                    <span>Priorité support 24/7</span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="h-5 w-5 text-indigo-600 mr-3" />
                                    <span>Bot Discord (Fonctions avancées)</span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="h-5 w-5 text-indigo-600 mr-3" />
                                    <span>Accès API (Bientôt)</span>
                                </li>
                            </ul>
                        </div>
                        <div className="p-8 bg-indigo-50 border-t border-indigo-100">
                            {user ? (
                                <form action={createCheckoutSession.bind(null, premiumPrice)}>
                                    <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-700 h-12 text-lg rounded-xl shadow-lg shadow-indigo-200">
                                        Choisir Premium
                                    </Button>
                                </form>
                            ) : (
                                <Link href="/login?next=/pricing">
                                    <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-700 h-12 text-lg rounded-xl shadow-lg shadow-indigo-200">
                                        Se connecter pour commander
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight, Layout, MessageSquare, Bot, Star, Shield, Smartphone } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-black selection:text-white">

      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="FiveRecruit" className="h-16 w-auto object-contain" />
          </Link>

          <div className="flex gap-4 items-center">
            <Link href="/pricing" className="text-sm font-semibold text-gray-600 hover:text-black transition-colors hidden md:block">
              Tarifs
            </Link>
            <Link href="/login">
              <Button variant="ghost" className="text-gray-600 hover:text-black hover:bg-gray-50 rounded-full px-6 font-medium">
                Connexion
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-6 font-bold shadow-lg hover:shadow-xl transition-all h-10">
                S'inscrire
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 md:pt-52 md:pb-32 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">

            {/* Text Content */}
            <div className="flex-1 text-center md:text-left animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-bold uppercase tracking-wider text-gray-600 mb-8">
                <Star className="h-3 w-3 fill-gray-600" />
                Le choix des serveurs Premium
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-black mb-8 leading-[1.1]">
                Recrutez.<br />
                Gérez.<br />
                <span className="text-gray-400">Brillez.</span>
              </h1>

              <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-lg mx-auto md:mx-0 font-medium">
                FiveRecruit n'est pas juste un outil. C'est le standard de qualité pour les communautés qui exigent l'excellence.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link href="/dashboard">
                  <Button className="h-14 px-8 rounded-full bg-black text-white hover:bg-gray-800 text-lg font-bold shadow-xl transition-transform hover:scale-105">
                    Commencer
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" className="h-14 px-8 rounded-full border-gray-200 text-black hover:bg-gray-50 text-lg font-semibold">
                    En savoir plus
                  </Button>
                </Link>
              </div>
            </div>

            {/* Visual Content: Clean Dashboard Preview */}
            <div className="flex-1 w-full relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-100">
              <div className="relative rounded-3xl bg-gray-50 p-4 border border-gray-100 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)]">
                <div className="absolute top-4 left-4 flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="mt-6 rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 aspect-[4/3] flex flex-col">
                  {/* Abstract Header */}
                  <div className="h-16 border-b border-gray-100 flex items-center px-6 justify-between">
                    <div className="w-24 h-4 bg-gray-100 rounded-full"></div>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
                      <div className="w-8 h-8 bg-black rounded-full"></div>
                    </div>
                  </div>
                  {/* Abstract Grid */}
                  <div className="p-6 grid grid-cols-2 gap-4 bg-gray-50/50 flex-1">
                    <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100 flex flex-col gap-3">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                        <Bot className="h-5 w-5" />
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full"></div>
                      <div className="w-2/3 h-2 bg-gray-100 rounded-full"></div>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100 flex flex-col gap-3">
                      <div className="w-10 h-10 bg-pink-50 text-pink-600 rounded-lg flex items-center justify-center">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full"></div>
                      <div className="w-2/3 h-2 bg-gray-100 rounded-full"></div>
                    </div>
                    <div className="col-span-2 rounded-xl bg-black p-4 text-white flex items-center justify-between shadow-lg">
                      <div className="flex flex-col gap-2">
                        <div className="w-24 h-2 bg-gray-600 rounded-full"></div>
                        <div className="w-16 h-2 bg-gray-700 rounded-full"></div>
                      </div>
                      <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Element */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4 animate-bounce duration-[3000ms]">
                <div className="bg-green-100 p-2 rounded-full">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Status</p>
                  <p className="font-bold text-gray-900">Bot Actif</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid (Uber Style) */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="mb-20">
            <h2 className="text-3xl md:text-5xl font-extrabold text-black mb-6">Tout ce dont vous avez besoin.</h2>
            <p className="text-xl text-gray-600 max-w-2xl">Une suite d'outils puissants, emballée dans une interface si simple que vous saurez l'utiliser instantanément.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center mb-8">
                <Bot className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Bot Discord</h3>
              <p className="text-gray-600 leading-relaxed font-medium">Synchronisation automatique des rôles. Notifications en temps réel. Ne quittez jamais votre serveur Discord.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-gray-100 text-black rounded-2xl flex items-center justify-center mb-8">
                <Layout className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Kanban Intuitif</h3>
              <p className="text-gray-600 leading-relaxed font-medium">Gérez vos candidatures comme des pros. Glissez, déposez, validez. Une vue d'ensemble claire de votre pipeline.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-gray-100 text-black rounded-2xl flex items-center justify-center mb-8">
                <Smartphone className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Responsive</h3>
              <p className="text-gray-600 leading-relaxed font-medium">Votre dashboard est accessible partout. Gérez votre serveur depuis votre téléphone, votre tablette ou votre PC.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section (Simple & Clear) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-extrabold text-center text-black mb-16">Tarification transparente</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Standard */}
            <div className="rounded-3xl p-8 border border-gray-200 bg-white">
              <h3 className="text-2xl font-bold mb-2">Standard</h3>
              <p className="text-gray-500 mb-6">L'essentiel pour démarrer.</p>
              <div className="flex items-baseline mb-8">
                <span className="text-5xl font-extrabold tracking-tight">9.90€</span>
                <span className="text-gray-500 font-medium ml-2">/mois</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 font-medium text-gray-700">
                  <Check className="h-5 w-5 text-black" /> 5 Jobs
                </li>
                <li className="flex items-center gap-3 font-medium text-gray-700">
                  <Check className="h-5 w-5 text-black" /> Candidatures illimitées
                </li>
                <li className="flex items-center gap-3 font-medium text-gray-700">
                  <Check className="h-5 w-5 text-black" /> Bot Discord de base
                </li>
              </ul>
              <Link href="/pricing">
                <Button className="w-full h-12 rounded-xl bg-gray-100 text-black hover:bg-gray-200 border border-gray-200 font-bold text-lg">
                  Choisir Standard
                </Button>
              </Link>
            </div>

            {/* Premium */}
            <div className="rounded-3xl p-8 border border-gray-200 bg-black text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-white text-black text-xs font-bold px-4 py-2 rounded-bl-xl uppercase tracking-wider">
                Populaire
              </div>
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <p className="text-gray-400 mb-6">Pour les communautés établies.</p>
              <div className="flex items-baseline mb-8">
                <span className="text-5xl font-extrabold tracking-tight">19.90€</span>
                <span className="text-gray-400 font-medium ml-2">/mois</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 font-medium">
                  <Check className="h-5 w-5 text-white" /> Jobs <span className="font-bold">Illimités</span>
                </li>
                <li className="flex items-center gap-3 font-medium">
                  <Check className="h-5 w-5 text-white" /> Bot Discord <span className="font-bold">Avancé</span>
                </li>
                <li className="flex items-center gap-3 font-medium">
                  <Check className="h-5 w-5 text-white" /> Support Prioritaire
                </li>
              </ul>
              <Link href="/pricing">
                <Button className="w-full h-12 rounded-xl bg-white text-black hover:bg-gray-100 font-bold text-lg">
                  Choisir Premium
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (Minimal) */}
      <footer className="py-12 border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="FiveRecruit" className="h-8 w-auto grayscale opacity-40 mix-blend-multiply" />
            <span className="text-gray-400 text-sm font-semibold">© 2026 FiveRecruit</span>
          </div>
          <div className="flex gap-8">
            <Link href="#" className="text-gray-500 hover:text-black hover:underline underline-offset-4 text-sm font-medium transition-colors">Légal</Link>
            <Link href="#" className="text-gray-500 hover:text-black hover:underline underline-offset-4 text-sm font-medium transition-colors">Confidentialité</Link>
            <Link href="#" className="text-gray-500 hover:text-black hover:underline underline-offset-4 text-sm font-medium transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

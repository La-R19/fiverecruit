'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldCheck, FileText, Users, Zap, Layout, ArrowRight, CheckCircle2, MessageSquare, Bot, Crown, Sparkles, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden font-sans selection:bg-indigo-500 selection:text-white">

      {/* Navbar Overlay */}
      <nav className="fixed top-0 z-50 w-full bg-black/50 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="FiveRecruit" className="h-14 w-auto object-contain hover:scale-110 transition-transform duration-300" />
            {/* Logo text removed as requested, just the icon usually implies brand, but we can keep text hidden or minimal if needed. 
                User asked to remove text previously. */}
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/pricing" className="text-sm font-medium text-gray-400 hover:text-white transition-colors hidden md:block">
              Tarifs
            </Link>
            <Link href="/login">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10 rounded-full px-6">
                Connexion
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-white text-black hover:bg-gray-200 rounded-full px-6 font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-300">
                S'inscrire
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with 3D Effect */}
      <section className="relative pt-40 pb-32 md:pt-52 md:pb-48 px-6 flex flex-col items-center text-center overflow-hidden perspective-1000">

        {/* Dynamic Background */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-black to-black"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] -z-10 animate-pulse duration-[5000ms]"></div>

        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl text-xs font-semibold text-indigo-300 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 border-t-indigo-500/50">
          <Sparkles className="h-3 w-3 fill-indigo-300" />
          <span className="tracking-in-expand">La solution ultime pour FiveM</span>
        </div>

        <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1] max-w-5xl mx-auto text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-500 drop-shadow-2xl animate-in fade-in zoom-in-50 duration-1000 slide-in-from-bottom-10">
          Recrutez <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">sans limites.</span>
        </h1>

        <p className="text-lg md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-12 font-medium text-balance animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
          Automatisez vos candidatures, synchronisez avec Discord et gérez votre staff avec une interface futuriste conçue pour l'élite.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
          <Link href="/dashboard">
            <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] border border-indigo-400/30">
              Commencer maintenant
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-white/20 bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm">
              Découvrir les fonctionnalités
            </Button>
          </Link>
        </div>

        {/* 3D Dashboard Mockup Effect */}
        <div className="mt-24 relative w-full max-w-5xl mx-auto group perspective-1000 animate-in fade-in slide-in-from-bottom-24 duration-1000 delay-500">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl overflow-hidden transform transition-transform duration-700 hover:rotate-x-2 hover:scale-[1.01]">
            {/* Abstract UI Representation */}
            <div className="p-4 border-b border-white/10 flex items-center gap-4 bg-white/5">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="h-6 w-96 rounded-full bg-white/5 mx-auto"></div>
            </div>
            <div className="aspect-video bg-[#0f0f11] flex items-center justify-center relative">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
              <div className="grid grid-cols-3 gap-8 p-12 w-full h-full items-center opacity-80">
                {/* Fake Cards */}
                <div className="aspect-[4/3] rounded-xl bg-white/5 border border-white/10 p-6 flex flex-col gap-4 animate-pulse">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/20"></div>
                  <div className="w-3/4 h-4 rounded bg-white/10"></div>
                  <div className="w-1/2 h-4 rounded bg-white/10"></div>
                </div>
                <div className="aspect-[4/3] rounded-xl bg-white/5 border border-white/10 p-6 flex flex-col gap-4 scale-110 shadow-2xl bg-white/10 z-10">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20"></div>
                  <div className="w-3/4 h-4 rounded bg-white/20"></div>
                  <div className="w-full h-24 rounded bg-gradient-to-br from-indigo-500/20 to-purple-500/20"></div>
                </div>
                <div className="aspect-[4/3] rounded-xl bg-white/5 border border-white/10 p-6 flex flex-col gap-4 animate-pulse delay-75">
                  <div className="w-12 h-12 rounded-full bg-pink-500/20"></div>
                  <div className="w-3/4 h-4 rounded bg-white/10"></div>
                  <div className="w-1/2 h-4 rounded bg-white/10"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-32 relative bg-black">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-20 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Pourquoi l'élite nous choisit ?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 max-w-6xl mx-auto h-[1200px] md:h-[800px]">

            {/* Major Feature 1: Bot Discord */}
            <div className="md:col-span-2 md:row-span-2 group relative rounded-3xl border border-white/10 bg-[#0a0a0a] overflow-hidden hover:border-indigo-500/50 transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="p-10 h-full flex flex-col justify-between relative z-10">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6 border border-indigo-500/30 text-indigo-400">
                    <Bot className="h-7 w-7" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Bot Discord Intelligent</h3>
                  <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                    Ne gérez plus jamais vos tickets à la main. Notre bot synchronise automatiquement les candidatures, notifie les recruteurs et gère les rôles directement depuis Discord.
                  </p>
                  <ul className="mt-8 space-y-3 text-gray-300">
                    <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-indigo-500" /> Synchronisation temps réel</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-indigo-500" /> Notifications instantanées</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-indigo-500" /> Commande /apply intégrée</li>
                  </ul>
                </div>
                <div className="mt-8 rounded-xl bg-[#1a1a1e] border border-white/5 p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-600"></div>
                    <div className="bg-[#2f3136] rounded px-3 py-1 text-xs text-gray-300">Nouvelle candidature de @Voltre !</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-600"></div>
                    <div className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-200 rounded px-3 py-1 text-xs">Candidature acceptée ✅</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Kanban */}
            <div className="group relative rounded-3xl border border-white/10 bg-[#0a0a0a] overflow-hidden hover:border-purple-500/50 transition-colors duration-500">
              <div className="p-8 h-full flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 border border-purple-500/30 text-purple-400">
                  <Layout className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Kanban Drag & Drop</h3>
                <p className="text-gray-400 text-sm">Organisez visuellement votre recrutement. Glissez-déposez les candidats comme sur Trello.</p>
              </div>
            </div>

            {/* Feature 3: Custom Forms */}
            <div className="group relative rounded-3xl border border-white/10 bg-[#0a0a0a] overflow-hidden hover:border-pink-500/50 transition-colors duration-500">
              <div className="p-8 h-full flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center mb-4 border border-pink-500/30 text-pink-400">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Formulaires 100% Custom</h3>
                <p className="text-gray-400 text-sm">Questions texte, choix multiples, fichiers... Créez le formulaire parfait pour vos besoins.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Pricing Section (Glass/Dark) */}
      <section className="py-32 relative overflow-hidden">
        {/* Abstract Background for Pricing */}
        <div className="absolute inset-0 bg-gradient-to-b from-black to-indigo-950/20 pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-6">Investissez dans la <span className="text-indigo-400">qualité</span></h2>
          <p className="text-gray-400 text-center max-w-xl mx-auto mb-20 text-lg">Rejoignez des centaines de serveurs qui ont professionnalisé leur recrutement.</p>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Standard Plan */}
            <div className="rounded-3xl p-8 border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
              <h3 className="text-2xl font-bold text-gray-200">Standard</h3>
              <div className="flex items-baseline mt-4 mb-6">
                <span className="text-4xl font-bold">9.90€</span>
                <span className="text-gray-500 ml-2">/mois</span>
              </div>
              <ul className="space-y-4 mb-8 text-gray-300">
                <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-gray-500" /> 5 Jobs actifs</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-gray-500" /> Candidatures illimitées</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-gray-500" /> Bot Discord Essentiel</li>
              </ul>
              <Link href="/pricing">
                <Button className="w-full h-12 rounded-xl bg-white text-black hover:bg-gray-200 font-bold">Choisir Standard</Button>
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="relative rounded-3xl p-8 border border-indigo-500/50 bg-gradient-to-b from-indigo-900/20 to-black overflow-hidden transform md:scale-105 shadow-2xl">
              <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-bl-xl">POPULAIRE</div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                Premium <Crown className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              </h3>
              <div className="flex items-baseline mt-4 mb-6">
                <span className="text-5xl font-black text-white">19.90€</span>
                <span className="text-indigo-300 ml-2">/mois</span>
              </div>
              <ul className="space-y-4 mb-8 text-indigo-100">
                <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-indigo-400" /> Jobs <span className="font-bold text-white">ILLIMITÉS</span></li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-indigo-400" /> Support Prioritaire 24/7</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-indigo-400" /> Bot Discord <span className="font-bold text-white">AVANCÉ</span></li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-indigo-400" /> Accès API (Roadmap)</li>
              </ul>
              <Link href="/pricing">
                <Button className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-[0_0_20px_rgba(79,70,229,0.4)]">Passer au niveau supérieur</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 bg-black">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="FiveRecruit" className="h-8 w-auto opacity-50 grayscale hover:grayscale-0 transition-all" />
            <span className="text-gray-500 font-semibold">FiveRecruit &copy; 2026</span>
          </div>
          <div className="flex gap-8 text-sm text-gray-500">
            <Link href="#" className="hover:text-white transition-colors">Mentions Légales</Link>
            <Link href="#" className="hover:text-white transition-colors">CGV</Link>
            <Link href="#" className="hover:text-white transition-colors">Discord</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

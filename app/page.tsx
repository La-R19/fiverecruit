'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight, Layout, MessageSquare, Shield, Smartphone, Users, Zap, Star } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-black selection:text-white overflow-x-hidden">

      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 transition-all duration-300">
        <div className="container mx-auto px-6 h-24 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
            <img src="/logo.png" alt="FiveRecruit" className="h-20 w-auto object-contain" />
          </Link>

          <div className="flex gap-6 items-center">
            <Link href="/pricing" className="text-sm font-bold text-gray-500 hover:text-black transition-colors hidden md:block">
              TARIFS
            </Link>
            <Link href="/login">
              <Button variant="ghost" className="text-gray-600 hover:text-black hover:bg-gray-50 rounded-full px-6 font-bold tracking-wide">
                CONNEXION
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-black text-white hover:bg-gray-900 rounded-full px-8 py-6 font-bold shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
                COMMENCER
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 z-10">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-20">

            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 text-xs font-bold uppercase tracking-widest text-gray-600 mb-10 border border-black/5">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-500" />
                Le standard Premium
              </div>

              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-black mb-8 leading-[0.95] drop-shadow-sm">
                RECRUTEZ <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-800">SANS LIMITES.</span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-500 mb-12 leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium text-balance">
                Une interface de gestion conçue pour les serveurs qui ne font aucun compromis sur la qualité.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                <Link href="/dashboard">
                  <Button className="h-16 px-10 rounded-full bg-black text-white hover:bg-gray-800 text-lg font-bold shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_60px_-12px_rgba(0,0,0,0.4)] transition-all hover:scale-105 duration-300">
                    Créer mon compte
                  </Button>
                </Link>
              </div>
            </div>

            {/* Visual Content: High-Impact Dashboard Mockup */}
            <div className="flex-1 w-full relative animate-in fade-in slide-in-from-right-12 duration-1000 delay-200 lg:perspective-[2000px]">
              {/* Decorative Blobs */}
              <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-full blur-3xl opacity-50 -z-10 animate-pulse"></div>

              {/* Main Card */}
              <div className="relative rounded-[2.5rem] bg-white p-6 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-gray-100 transform transition-transform duration-700 hover:rotate-y-2 hover:rotate-x-2">

                {/* Window Controls */}
                <div className="absolute top-8 left-8 flex gap-2 z-20">
                  <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                </div>

                {/* Inner Content */}
                <div className="mt-8 rounded-3xl overflow-hidden bg-gray-50 aspect-[4/3] flex flex-col relative group">
                  {/* Header */}
                  <div className="bg-white h-20 border-b border-gray-100 flex items-center justify-between px-8">
                    <div className="w-32 h-4 bg-gray-100 rounded-full"></div>
                    <div className="w-10 h-10 bg-black rounded-full shadow-lg"></div>
                  </div>
                  {/* Body */}
                  <div className="p-8 grid grid-cols-2 gap-6">
                    {/* Card 1 */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                      <div className="w-12 h-12 bg-gray-900 rounded-xl mb-4 flex items-center justify-center text-white">
                        <Users className="h-6 w-6" />
                      </div>
                      <div className="w-24 h-3 bg-gray-100 rounded-full mb-2"></div>
                      <div className="w-16 h-3 bg-gray-100 rounded-full"></div>
                    </div>
                    {/* Card 2 */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1 delay-75">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl mb-4 flex items-center justify-center text-gray-500">
                        <Layout className="h-6 w-6" />
                      </div>
                      <div className="w-24 h-3 bg-gray-100 rounded-full mb-2"></div>
                      <div className="w-16 h-3 bg-gray-100 rounded-full"></div>
                    </div>
                    {/* Wide Card */}
                    <div className="col-span-2 bg-black p-6 rounded-2xl shadow-lg flex items-center justify-between hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                      <div className="flex flex-col gap-3">
                        <div className="w-40 h-3 bg-white/20 rounded-full"></div>
                        <div className="w-24 h-3 bg-white/10 rounded-full"></div>
                      </div>
                      <span className="text-white font-bold text-2xl tracking-tighter">98%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Tag */}
              <div className="absolute -bottom-8 -left-8 bg-white py-4 px-6 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-50 flex items-center gap-4 animate-bounce duration-[4000ms]">
                <div className="h-10 w-10 bg-black text-white rounded-full flex items-center justify-center">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Validé</p>
                  <p className="font-bold text-lg text-black">FiveRecruit V1</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid (Bigger, Bolder) */}
      <section id="features" className="py-32 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="mb-24 text-center">
            <h2 className="text-4xl md:text-6xl font-black text-black mb-8 tracking-tighter">TOUT EST LÀ.</h2>
            <p className="text-2xl text-gray-500 max-w-3xl mx-auto font-medium">Une suite d'outils puissants pour une gestion sans friction.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
              <div className="w-16 h-16 bg-black text-white rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500 shadow-xl">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-bold mb-4 tracking-tight">Gestion d'Équipe</h3>
              <p className="text-gray-500 leading-relaxed font-medium text-lg">Attribuez des rôles, gérez les permissions et suivez l'activité de votre staff en temps réel.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
              <div className="w-16 h-16 bg-gray-100 text-black rounded-3xl flex items-center justify-center mb-10 group-hover:bg-gray-200 transition-colors duration-500">
                <Layout className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-bold mb-4 tracking-tight">Kanban Intuitif</h3>
              <p className="text-gray-500 leading-relaxed font-medium text-lg">Une vue d'ensemble claire de votre pipeline de recrutement. Glissez, déposez, c'est validé.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
              <div className="w-16 h-16 bg-gray-100 text-black rounded-3xl flex items-center justify-center mb-10 group-hover:bg-gray-200 transition-colors duration-500">
                <Smartphone className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-bold mb-4 tracking-tight">Mobile First</h3>
              <p className="text-gray-500 leading-relaxed font-medium text-lg">Votre serveur ne dort jamais. Gérez les candidatures depuis votre poche, où que vous soyez.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section (Clean & Impactful) */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-center text-black mb-24 tracking-tighter">TARIFICATION <br /><span className="text-gray-300">TRANSPARENTE</span></h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Standard */}
            <div className="rounded-[2.5rem] p-10 border border-gray-100 bg-white hover:border-gray-300 transition-colors duration-300">
              <h3 className="text-2xl font-bold mb-2">Standard</h3>
              <p className="text-gray-400 mb-8 font-medium">Pour démarrer proprement.</p>
              <div className="flex items-baseline mb-10">
                <span className="text-6xl font-black tracking-tight">9.90€</span>
                <span className="text-gray-500 font-bold ml-2">/mois</span>
              </div>
              <ul className="space-y-5 mb-10">
                <li className="flex items-center gap-4 font-bold text-gray-700">
                  <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center"><Check className="h-3 w-3 text-black" /></div> 5 Jobs
                </li>
                <li className="flex items-center gap-4 font-bold text-gray-700">
                  <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center"><Check className="h-3 w-3 text-black" /></div> Candidatures illimitées
                </li>
                <li className="flex items-center gap-4 font-bold text-gray-700">
                  <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center"><Check className="h-3 w-3 text-black" /></div> Support Basic
                </li>
              </ul>
              <Link href="/pricing">
                <Button className="w-full h-16 rounded-2xl bg-gray-50 text-black hover:bg-gray-100 border border-gray-200 font-bold text-lg tracking-wide transition-colors">
                  Choisir Standard
                </Button>
              </Link>
            </div>

            {/* Premium */}
            <div className="rounded-[2.5rem] p-10 border border-black bg-black text-white shadow-2xl relative overflow-hidden transform md:scale-105 hover:scale-[1.07] transition-transform duration-500">
              <div className="absolute top-0 right-0 bg-white/10 backdrop-blur-md text-white border-l border-b border-white/20 text-xs font-bold px-6 py-3 rounded-bl-3xl uppercase tracking-widest">
                Best Seller
              </div>
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <p className="text-gray-400 mb-8 font-medium">L'expérience complète.</p>
              <div className="flex items-baseline mb-10">
                <span className="text-6xl font-black tracking-tight">19.90€</span>
                <span className="text-gray-400 font-bold ml-2">/mois</span>
              </div>
              <ul className="space-y-5 mb-10">
                <li className="flex items-center gap-4 font-bold">
                  <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center"><Check className="h-3 w-3 text-white" /></div> Jobs <span className="text-white border-b-2 border-white">ILLIMITÉS</span>
                </li>
                <li className="flex items-center gap-4 font-bold">
                  <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center"><Check className="h-3 w-3 text-white" /></div> Accès Prioritaire
                </li>
                <li className="flex items-center gap-4 font-bold">
                  <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center"><Check className="h-3 w-3 text-white" /></div> Support 24/7
                </li>
              </ul>
              <Link href="/pricing">
                <Button className="w-full h-16 rounded-2xl bg-white text-black hover:bg-gray-100 font-bold text-lg tracking-wide shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-shadow">
                  Passer Premium
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (Minimal) */}
      <footer className="py-16 border-t border-gray-100 bg-white">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <img src="/logo.png" alt="FiveRecruit" className="h-12 w-auto grayscale opacity-100" />
            <p className="text-gray-400 font-medium max-w-xs text-center md:text-left">La plateforme de recrutement nouvelle génération pour FiveM.</p>
          </div>
          <div className="flex gap-10">
            <Link href="#" className="text-gray-500 hover:text-black font-bold text-sm tracking-wide transition-colors uppercase">Légal</Link>
            <Link href="#" className="text-gray-500 hover:text-black font-bold text-sm tracking-wide transition-colors uppercase">CGV</Link>
            <Link href="#" className="text-gray-500 hover:text-black font-bold text-sm tracking-wide transition-colors uppercase">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

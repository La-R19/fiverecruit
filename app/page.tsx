import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldCheck, FileText, Users, Zap, Layout, ArrowRight, CheckCircle2, MoreHorizontal, Search, Bell } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#1D1D1F] overflow-x-hidden font-sans selection:bg-black selection:text-white">

      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 transition-all duration-300">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <img src="/logo.png" alt="FiveRecruit" className="h-32 w-auto object-contain" />
          <div className="flex gap-3 items-center">
            <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-black mr-4 hidden md:block">
              Tarifs
            </Link>
            <Link href="/login">
              <Button variant="ghost" className="text-gray-600 hover:text-black hover:bg-black/5 rounded-full px-5 font-medium">
                Connexion
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-5 shadow-lg shadow-black/20 hover:shadow-xl hover:scale-105 transition-all duration-300">
                S'inscrire
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-32 md:pt-48 md:pb-48 px-6 flex flex-col items-center text-center relative overflow-hidden">
        {/* Subtle Gradient Background */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white opacity-70"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-br from-indigo-100/40 to-purple-100/40 rounded-full blur-[100px] -z-10"></div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1)] text-xs font-semibold text-gray-600 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="flex h-2 w-2 rounded-full bg-indigo-500"></span>
          v1.0 disponible maintenant
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 leading-[1.05] max-w-5xl mx-auto text-black drop-shadow-sm">
          Le recrutement FiveM <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">réinventé.</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10 font-medium text-balance">
          Créez des formulaires immersifs, gérez vos équipes et suivez chaque candidature avec une précision chirurgicale.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-32 relative z-20">
          <Link href="/login">
            <Button size="lg" className="h-14 px-10 rounded-full text-lg bg-black text-white hover:bg-gray-800 hover:scale-105 transition-all shadow-xl shadow-indigo-500/20">
              Commencer gratuitement
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="h-14 px-10 rounded-full text-lg border-gray-200 bg-white text-black hover:bg-gray-50 transition-all hover:border-gray-300 shadow-sm">
              Voir la démo
            </Button>
          </Link>
        </div>

        {/* REALISTIC 3D DASHBOARD PREVIEW */}
        <div className="relative max-w-6xl mx-auto w-full group perspective-1200 px-4">
          <div className="relative rounded-2xl overflow-hidden bg-white shadow-[0_50px_100px_-20px_rgba(50,50,93,0.15),0_30px_60px_-30px_rgba(0,0,0,0.2)] border border-gray-200/60 transform transition-transform duration-1000 group-hover:rotate-x-2 group-hover:scale-[1.01] rotate-x-6" style={{ transformStyle: "preserve-3d" }}>

            {/* Browser/Window Controls */}
            <div className="w-full h-10 bg-[#FAFAFA] border-b border-gray-200 flex items-center px-4 gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57] border border-[#E0443E]" />
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E] border border-[#D89E24]" />
                <div className="w-3 h-3 rounded-full bg-[#28C840] border border-[#1AAB29]" />
              </div>
              <div className="flex-1 text-center">
                <div className="inline-flex items-center gap-2 bg-gray-200/50 px-3 py-1 rounded-md text-[10px] text-gray-500 font-medium">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  app.fiverecruit.com
                </div>
              </div>
              <div className="w-16" /> {/* Spacer */}
            </div>

            {/* MOCK UI CONTENT */}
            <div className="flex h-[600px] w-full bg-[#F5F7FA] text-left">

              {/* Sidebar */}
              <div className="w-20 lg:w-64 bg-white border-r border-gray-100 flex flex-col p-4 hidden md:flex">
                <div className="flex items-center gap-3 mb-10 px-2">
                  <div className="h-10 w-10 bg-black rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-white font-bold">P</span>
                  </div>
                  <span className="font-bold text-sm hidden lg:block text-gray-900">Premium Server</span>
                </div>
                <div className="space-y-1">
                  <div className="px-3 py-2.5 bg-gray-900 rounded-xl text-sm font-medium text-white flex items-center gap-3 shadow-lg shadow-gray-900/10">
                    <Layout className="w-5 h-5" /> <span className="hidden lg:block">Dashboard</span>
                  </div>
                  <div className="px-3 py-2.5 hover:bg-gray-50 rounded-xl text-sm font-medium text-gray-500 flex items-center gap-3 transition-colors">
                    <FileText className="w-5 h-5" /> <span className="hidden lg:block">Formulaires</span>
                  </div>
                  <div className="px-3 py-2.5 hover:bg-gray-50 rounded-xl text-sm font-medium text-gray-500 flex items-center gap-3 transition-colors">
                    <Users className="w-5 h-5" /> <span className="hidden lg:block">Candidats</span>
                    <span className="ml-auto bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full hidden lg:block">12</span>
                  </div>
                  <div className="px-3 py-2.5 hover:bg-gray-50 rounded-xl text-sm font-medium text-gray-500 flex items-center gap-3 transition-colors">
                    <Zap className="w-5 h-5" /> <span className="hidden lg:block">Paramètres</span>
                  </div>
                </div>
              </div>

              {/* Main Content (Kanban) */}
              <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <div className="h-20 border-b border-gray-100 bg-white flex items-center justify-between px-8">
                  <div>
                    <h2 className="font-bold text-xl text-gray-900">Recrutement: LSPD</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Pipeline actif</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-white"></div>
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 border-2 border-white"></div>
                      <div className="w-9 h-9 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600">+3</div>
                    </div>
                    <Button size="sm" className="bg-black text-white rounded-full px-6 h-9 hover:bg-gray-800 transition-colors shadow-lg shadow-black/10">
                      Inviter
                    </Button>
                  </div>
                </div>

                {/* Kanban Board */}
                <div className="flex-1 p-8 overflow-x-auto overflow-y-hidden">
                  <div className="flex gap-8 h-full min-w-max">

                    {/* Column 1 */}
                    <div className="w-80 flex flex-col gap-5">
                      <div className="flex items-center justify-between mb-2 px-1">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                          <span className="font-semibold text-sm text-gray-700">Nouvelles</span>
                          <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs font-medium">2</span>
                        </div>
                        <MoreHorizontal className="w-4 h-4 text-gray-400 cursor-pointer" />
                      </div>

                      {/* Card 1 */}
                      <div className="bg-white p-5 rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-[0_8px_16px_-4px_rgba(0,0,0,0.08)] transition-all cursor-pointer group/card hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-600 font-bold text-sm">TD</div>
                          <span className="text-[10px] bg-orange-50 text-orange-600 border border-orange-100 px-2.5 py-1 rounded-full font-semibold">En attente</span>
                        </div>
                        <h4 className="font-bold text-base text-gray-900 mb-1">Thomas Dubreuil</h4>
                        <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed">"Je suis motivé pour rejoindre vos effectifs, fort de 3 ans d'expérience..."</p>
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                            <FileText className="w-3.5 h-3.5" /> CV.pdf
                          </div>
                        </div>
                      </div>

                      {/* Card 2 */}
                      <div className="bg-white p-5 rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-gray-100 opacity-70 hover:opacity-100 transition-all cursor-pointer">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 font-bold text-sm">MR</div>
                          <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-full font-semibold">Nouveau</span>
                        </div>
                        <h4 className="font-bold text-base text-gray-900 mb-1">Maxime R.</h4>
                        <p className="text-xs text-gray-500">Ancien EMS sur serveur whitelist, disponible le soir.</p>
                      </div>
                    </div>

                    {/* Column 2 */}
                    <div className="w-80 flex flex-col gap-5">
                      <div className="flex items-center justify-between mb-2 px-1">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                          <span className="font-semibold text-sm text-gray-700">En Entretien</span>
                          <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs font-medium">1</span>
                        </div>
                        <MoreHorizontal className="w-4 h-4 text-gray-400 cursor-pointer" />
                      </div>

                      <div className="bg-white p-5 rounded-2xl shadow-[0_4px_12px_-2px_rgba(99,102,241,0.1)] border border-indigo-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                        <div className="flex justify-between items-start mb-4 pl-2">
                          <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                            {/* Avatar Placeholder */}
                          </div>
                          <span className="text-[10px] bg-indigo-50 text-indigo-600 border border-indigo-100 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                            Aujourd'hui 14h
                          </span>
                        </div>
                        <div className="pl-2">
                          <h4 className="font-bold text-base text-gray-900 mb-1">Sarah Connor</h4>
                          <p className="text-xs text-gray-500 mb-4">Entretien Discord planifié avec les officiers supérieurs.</p>
                          <div className="flex -space-x-2">
                            <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white text-[8px] flex items-center justify-center font-bold text-gray-500">O1</div>
                            <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white text-[8px] flex items-center justify-center font-bold text-gray-600">LT</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Column 3 */}
                    <div className="w-80 flex flex-col gap-5">
                      <div className="flex items-center justify-between mb-2 px-1">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="font-semibold text-sm text-gray-700">Acceptés</span>
                          <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs font-medium">5</span>
                        </div>
                        <MoreHorizontal className="w-4 h-4 text-gray-400 cursor-pointer" />
                      </div>

                      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 opacity-90">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 font-bold text-sm">JK</div>
                          <span className="text-[10px] bg-green-50 text-green-600 border border-green-100 px-2.5 py-1 rounded-full font-semibold">Validé</span>
                        </div>
                        <h4 className="font-bold text-base text-gray-900 mb-1">Jean Kevin</h4>
                        <p className="text-xs text-gray-500">Assigné: Officier I</p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Notification */}
          <div className="absolute -right-2 md:-right-8 top-24 bg-white p-5 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-gray-100 animate-in fade-in slide-in-from-right-8 duration-1000 delay-500 hidden lg:block max-w-sm z-30">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex-shrink-0 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900 mb-1">Candidature Acceptée</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  La candidature de <span className="font-medium text-gray-700">Jean Kevin</span> a été validée par l'équipe LSPD.
                </p>
                <p className="text-[10px] text-gray-400 mt-2 font-medium">Il y a 2 min • via Discord Bot</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid with Apple Style */}
      <section id="features" className="py-32 bg-[#F5F5F7]">
        <div className="container mx-auto px-6">
          <div className="mb-20 max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-black mb-4">Puissance et Simplicité.</h2>
            <p className="text-xl text-gray-500">Tout ce dont vous avez besoin pour gérer votre communauté, sans la complexité.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* BENTO GRID ITEMS */}
            <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">
                <FileText className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Form Builder</h3>
              <p className="text-gray-500 leading-relaxed">Glissez-déposez vos questions. Textes, choix multiples, uploads... Créez le formulaire parfait en quelques secondes.</p>
            </div>

            <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">
                <Layout className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Vue Kanban</h3>
              <p className="text-gray-500 leading-relaxed">Arrêtez de jongler avec les channels Discord. Visualisez votre pipeline de recrutement global.</p>
            </div>

            <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Auth Sécurisée</h3>
              <p className="text-gray-500 leading-relaxed">Liez les candidatures aux comptes Discord réels. Évitez les trolls et les doubles comptes.</p>
            </div>

            <div className="col-span-1 md:col-span-3 bg-black text-white rounded-[2rem] p-10 md:p-16 relative overflow-hidden group">
              <div className="relative z-10 max-w-2xl">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8">
                  <Zap className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-4xl font-bold mb-6">Votre vitrine publique.</h3>
                <p className="text-gray-400 text-xl leading-relaxed mb-8">
                  Chaque serveur obtient une page publique dédiée, référencée et optimisée pour le SEO.
                  Partagez un seul lien, attirez les meilleurs talents.
                </p>
                <Link href="/login">
                  <span className="inline-flex items-center text-white font-semibold hover:underline cursor-pointer">
                    Voir un exemple <ArrowRight className="ml-2 w-4 h-4" />
                  </span>
                </Link>
              </div>
              <div className="absolute right-0 bottom-0 w-96 h-96 bg-gradient-to-tl from-indigo-600 to-purple-600 opacity-20 rounded-full blur-[100px] pointer-events-none group-hover:opacity-30 transition-opacity" />
            </div>
          </div>
        </div>
      </section>

      {/* Start Now */}
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-black mb-8">
            Le recrutement commence ici.
          </h2>
          <p className="text-xl text-gray-500 mb-12">
            Rejoignez des centaines de communautés qui font confiance à FiveRecruit.
          </p>
          <Link href="/login">
            <Button size="lg" className="h-16 px-12 rounded-full text-xl bg-black text-white hover:bg-gray-800 shadow-2xl hover:scale-105 transition-all w-full md:w-auto">
              Créer mon compte
            </Button>
          </Link>
        </div>
      </section>

      <footer className="py-12 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
            <div className="h-6 w-6 bg-black text-white rounded-md flex items-center justify-center text-xs font-bold">F</div>
            <span className="font-semibold text-sm">FiveRecruit</span>
          </div>
          <p className="text-sm text-gray-400">© 2026 FiveRecruit. All rights reserved.</p>
          <div className="flex gap-8 text-sm text-gray-500 font-medium">
            <Link href="#" className="hover:text-black transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-black transition-colors">Discord</Link>
            <Link href="#" className="hover:text-black transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

"use client"

import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import {
    LayoutDashboard,
    Settings,
    Users,
    FileText,
    Server,
    LogOut
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
    SidebarRail
} from "@/components/ui/sidebar"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

// Menu items.
const items = [
    {
        title: "Vue d'ensemble",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    // {
    //     title: "Mes Serveurs",
    //     url: "/dashboard", // Same as overview for now
    //     icon: Server,
    // },
]

export function DashboardSidebar() {
    const pathname = usePathname()
    const params = useParams()
    const router = useRouter()
    const supabase = createClient()

    // Extract serverId safely
    const serverId = params?.serverId as string | undefined

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }

    return (
        <Sidebar>
            <SidebarHeader className="border-b h-14 flex items-center justify-center">
                <div className="flex items-center gap-2 font-bold px-4 w-full">
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-black text-white text-xs">F</div>
                    <span className="truncate">FiveRecruit</span>
                </div>
            </SidebarHeader>

            <SidebarContent>
                {/* Main Menu (Global) */}
                <SidebarGroup>
                    <SidebarGroupLabel>Principal</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={pathname === item.url && !serverId}>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Server Context Menu (Conditional) */}
                {serverId && (
                    <SidebarGroup>
                        <SidebarGroupLabel>Gestion Serveur</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild isActive={pathname === `/dashboard/server/${serverId}`}>
                                        <Link href={`/dashboard/server/${serverId}`}>
                                            <Server className="text-blue-500" />
                                            <span className="font-medium text-blue-600">Dashboard Serveur</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild isActive={pathname?.includes('/team')}>
                                        <Link href={`/dashboard/server/${serverId}/team`}>
                                            <Users />
                                            <span>Équipe</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild isActive={pathname?.includes('/applications') || pathname?.includes('/kanban')}>
                                        <Link href={`/dashboard/server/${serverId}/applications`}>
                                            <FileText />
                                            <span>Candidatures</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>



                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild isActive={pathname?.includes('/settings')}>
                                        <Link href={`/dashboard/server/${serverId}/settings`}>
                                            <Settings />
                                            <span>Paramètres</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild isActive={pathname?.includes('/subscription')}>
                                        <Link href={`/dashboard/server/${serverId}/subscription`}>
                                            <span className="flex items-center gap-2">
                                                <Crown className="h-4 w-4" />
                                                <span>Abonnement</span>
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}
            </SidebarContent>

            <SidebarFooter className="border-t p-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={handleSignOut} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                            <LogOut />
                            <span>Déconnexion</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}

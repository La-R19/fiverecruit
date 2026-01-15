
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard/Sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <DashboardSidebar />
            <main className="w-full bg-gray-50/50 min-h-screen">
                <div className="border-b bg-white px-4 h-14 flex items-center">
                    <SidebarTrigger />
                    <div className="ml-4 text-sm text-gray-500">Tableau de bord</div>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    )
}

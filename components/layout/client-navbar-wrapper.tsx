
"use client"

import { usePathname } from "next/navigation"

export function ClientNavbarVisibility({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    // Hide global navbar on public server pages
    // Public pages pattern: /server/[slug]...
    // Dashboard pages pattern: /dashboard/...

    if (pathname?.startsWith('/server/')) {
        return null
    }

    return <>{children}</>
}

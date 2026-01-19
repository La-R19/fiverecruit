'use client'

import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LogoutPage() {
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const signOut = async () => {
            await supabase.auth.signOut()
            router.push('/')
            router.refresh()
        }
        signOut()
    }, [router, supabase])

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Déconnexion en cours...</p>
        </div>
    )
}

"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function activateLicense(licenseKey: string, serverId: string) {
    const supabase = await createClient()

    // Get current user to verify permission (though RPC handles it too)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { message: "Non connecté" }

    // Call RPC to claim license
    const { data, error } = await supabase.rpc('claim_license', {
        p_server_id: serverId,
        p_license_key: licenseKey
    })

    if (error) {
        console.error("License Error:", error)
        return { message: "Erreur lors de l'activation (RPC Error)" }
    }

    // RPC returns JSON object with success/error
    // Type casting validation would be good here
    const result = data as any

    if (!result.success) {
        return { message: result.error || "Clé invalide ou déjà utilisée" }
    }

    revalidatePath(`/dashboard/server/${serverId}`)
    return { success: true, message: "Licence activée avec succès !", plan: result.plan }
}

"use server"

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { checkPermission } from "@/utils/permissions"

export async function deleteServer(serverId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Unauthorized")

    // 1. Permission Check
    const hasPermission = await checkPermission(serverId, 'can_delete_server')
    if (!hasPermission) {
        throw new Error("Permission refusée. Vous n'avez pas le droit de supprimer ce serveur.")
    }

    // 2. Recover Subscriptions and Licenses (Detach)

    // 2a. Detach Subscription
    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('id, status')
        .eq('server_id', serverId)
        .in('status', ['active', 'trialing'])
        .maybeSingle()

    if (subscription) {
        const { error: subError } = await supabase
            .from('subscriptions')
            .update({ server_id: null })
            .eq('id', subscription.id)

        if (subError) {
            console.error("Failed to detach subscription", subError)
            throw new Error("Erreur lors de la récupération de l'abonnement.")
        }
    }

    // 2b. Detach License (FiveM Key)
    // This was causing the FK violation: licenses_server_id_fkey
    const { error: licenseError } = await supabase
        .from('licenses')
        .update({ server_id: null })
        .eq('server_id', serverId)

    if (licenseError) {
        console.error("Failed to detach license", licenseError)
        throw new Error("Erreur lors de la libération de la licence FiveM.")
    }

    // 3. Delete Server
    const { error } = await supabase
        .from('servers')
        .delete()
        .eq('id', serverId)

    if (error) {
        console.error("Delete server error", error)
        throw new Error("Erreur lors de la suppression du serveur.")
    }

    // 4. Redirect
    redirect('/dashboard')
}

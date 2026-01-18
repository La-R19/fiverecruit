'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { checkPermission } from "@/utils/permissions"

export async function assignSubscription(serverId: string, subscriptionId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Unauthorized")

    // Check if user is admin of the server
    const canEditServer = await checkPermission(serverId, 'can_edit_server')
    if (!canEditServer) throw new Error("Permission denied")

    // Check if user OWNS the subscription
    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('user_id, status')
        .eq('id', subscriptionId)
        .single()

    if (!subscription || subscription.user_id !== user.id) {
        throw new Error("Invalid subscription")
    }

    if (subscription.status !== 'active' && subscription.status !== 'trialing') {
        throw new Error("Subscription is not active")
    }

    // Update the subscription with the server_id
    await supabase
        .from('subscriptions')
        .update({ server_id: serverId })
        .eq('id', subscriptionId)

    revalidatePath(`/dashboard/server/${serverId}/settings/subscription`)
    revalidatePath(`/dashboard/server/${serverId}`)
}

export async function unassignSubscription(serverId: string, subscriptionId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Permission check
    const canEditServer = await checkPermission(serverId, 'can_edit_server')
    if (!canEditServer) throw new Error("Permission denied")

    // Verify ownership
    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('user_id, server_id')
        .eq('id', subscriptionId)
        .single()

    if (!subscription || subscription.user_id !== user.id) {
        throw new Error("Invalid subscription")
    }

    // Ensure it belongs to this server
    if (subscription.server_id !== serverId) {
        throw new Error("Subscription not assigned to this server")
    }

    // Update
    await supabase
        .from('subscriptions')
        .update({ server_id: null })
        .eq('id', subscriptionId)

    revalidatePath(`/dashboard/server/${serverId}/settings/subscription`)
    revalidatePath(`/dashboard/server/${serverId}`)
}

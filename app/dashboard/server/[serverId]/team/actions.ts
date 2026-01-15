
"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createInvite(serverId: string, role: 'admin' | 'manager' | 'viewer') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    // Check permissions (Owner only for simplicity, or Admin)
    const { data: server } = await supabase.from('servers').select('owner_id').eq('id', serverId).single()

    // Allow owner or existing admin (RLS will also enforce, but good to check)
    // For MVP, strict check:
    if (server?.owner_id !== user.id) {
        // Check if is admin member
        const { data: member } = await supabase.from('server_members').select('role').eq('server_id', serverId).eq('user_id', user.id).single()
        if (member?.role !== 'admin') {
            throw new Error("Permission denied")
        }
    }

    // Generate simple code
    const code = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10)

    const { error } = await supabase.from('server_invites').insert({
        server_id: serverId,
        code: code,
        role: role,
        max_uses: 1 // Single use default
    })

    if (error) {
        console.error(error)
        throw new Error("Failed to create invite")
    }

    revalidatePath(`/dashboard/server/${serverId}/team`)
}

export async function deleteInvite(inviteId: string, serverId: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('server_invites').delete().eq('id', inviteId)
    if (error) throw error
    revalidatePath(`/dashboard/server/${serverId}/team`)
}

export async function removeMember(memberId: string, serverId: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('server_members').delete().eq('id', memberId)
    if (error) throw error
    revalidatePath(`/dashboard/server/${serverId}/team`)
}

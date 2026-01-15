
"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const serverSchema = z.object({
    name: z.string().min(3),
    slug: z.string().min(3).regex(/^[a-z0-9-]+$/, "Le slug ne doit contenir que des lettres minuscules, chiffres et tirets"),
    description: z.string().optional(),
    cover_image_url: z.string().url().optional().or(z.literal('')),
    discord_invite_url: z.string().url().optional().or(z.literal(''))
})

export async function updateServer(serverId: string, formData: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Unauthorized")

    // Validate
    const result = serverSchema.safeParse(formData)
    if (!result.success) {
        throw new Error(result.error.errors[0].message)
    }

    const { error } = await supabase
        .from('servers')
        .update({
            name: formData.name,
            slug: formData.slug,
            description: formData.description,
            cover_image_url: formData.cover_image_url,
            discord_invite_url: formData.discord_invite_url
        })
        .eq('id', serverId)
        .eq('owner_id', user.id)

    if (error) {
        console.error(error)
        if (error.code === '23505') throw new Error("Ce lien personnalisé (URL) est déjà pris.")
        throw new Error(`Erreur lors de la mise à jour: ${error.message} (${error.code})`)
    }

    revalidatePath(`/dashboard/server/${serverId}`)
    revalidatePath(`/dashboard/server/${serverId}/settings`)
    revalidatePath(`/server/${formData.slug}`)

    return { success: true }
}

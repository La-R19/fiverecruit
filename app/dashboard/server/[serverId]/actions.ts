
"use server"

import { z } from "zod"
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const jobSchema = z.object({
    title: z.string().min(2, "Le titre doit faire au moins 2 caractères."),
    description: z.string().optional(),
    contractType: z.string().optional(),
    whitelistRequired: z.boolean().optional(),
    icon: z.string().optional(),
    serverId: z.string().uuid().optional(), // Optional for updates
})

export async function createJob(prevState: any, formData: FormData) {
    const validatedFields = jobSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description') || undefined,
        contractType: formData.get('contractType') || undefined,
        serverId: formData.get('serverId'),
    })

    if (!validatedFields.success) {
        return {
            message: "Erreur de validation",
            errors: validatedFields.error.flatten().fieldErrors
        }
    }

    const { title, description, contractType, serverId } = validatedFields.data
    const supabase = await createClient()

    // Verify ownership/permissions (basic check for owner)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { message: "Non connecté" }

    // Check Subscription Limits
    // 1. Get current job count for this server
    const { count, error: countError } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('server_id', serverId)

    if (countError) {
        console.error("Job Count Error:", countError)
        return { message: "Erreur lors de la vérification des limites." }
    }

    // 2. Check Subscription
    const { checkSubscriptionStatus } = await import("@/utils/subscription")
    const { plan } = await checkSubscriptionStatus()

    const limits = {
        'free': 1,
        'standard': 5,
        'premium': Infinity
    }

    const currentLimit = limits[plan as keyof typeof limits] || 1
    const currentCount = count || 0

    if (currentCount >= currentLimit) {
        let planName = plan === 'free' ? 'Gratuit' : (plan === 'standard' ? 'Standard' : 'Premium')
        return {
            message: `Limite atteinte pour le plan ${planName} (${currentCount}/${currentLimit === Infinity ? '∞' : currentLimit}). Passez au plan supérieur pour en créer plus.`
        }
    }

    const { error } = await supabase.from('jobs').insert({
        title,
        description: description || '',
        contract_type: contractType || 'Temps plein',
        server_id: serverId,
        form_schema: [],
    })

    if (error) {
        console.error(error)
        return { message: "Erreur lors de la création du job" }
    }

    revalidatePath(`/dashboard/server/${serverId}`)
    return { message: null, success: true }
}

export async function updateJob(jobId: string, serverId: string, prevState: any, formData: FormData) {
    const validatedFields = jobSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        contractType: formData.get('contractType'),
        whitelistRequired: formData.get('whitelistRequired') === 'on',
        icon: formData.get('icon'),
    })

    if (!validatedFields.success) {
        return {
            message: "Erreur de validation",
            errors: validatedFields.error.flatten().fieldErrors
        }
    }

    const { title, description, contractType, whitelistRequired, icon } = validatedFields.data
    const supabase = await createClient()

    const { error } = await supabase
        .from('jobs')
        .update({
            title,
            description,
            contract_type: contractType,
            whitelist_required: whitelistRequired,
            icon
        })
        .eq('id', jobId)

    if (error) {
        console.error(error)
        return { message: "Erreur lors de la modification" }
    }

    revalidatePath(`/dashboard/server/${serverId}`)
    return { message: null, success: true }
}

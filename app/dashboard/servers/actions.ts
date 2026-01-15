
"use server"

import { z } from "zod"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

// Validation Schema
const serverSchema = z.object({
    name: z.string().min(3, { message: "Le nom doit faire au moins 3 caractères." }),
    slug: z.string().min(3, { message: "Le slug doit faire au moins 3 caractères." })
        .regex(/^[a-z0-9-]+$/, { message: "Le slug ne doit contenir que des minuscules, chiffres et tirets." }),
    description: z.string().optional(),
})

export type ServerState = {
    errors?: {
        name?: string[];
        slug?: string[];
        description?: string[];
        _form?: string[];
    };
    message?: string | null;
}

export async function createServer(prevState: ServerState, formData: FormData) {
    const validatedFields = serverSchema.safeParse({
        name: formData.get('name'),
        slug: formData.get('slug'),
        description: formData.get('description'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Erreur de validation.',
        }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return {
            message: 'Vous devez être connecté.',
        }
    }

    const { name, slug, description } = validatedFields.data

    try {
        const { error } = await supabase.from('servers').insert({
            name,
            slug,
            description,
            owner_id: user.id,
            // Default cover for now
            cover_image_url: "https://images.unsplash.com/photo-1614741118868-b4b7902ce2c6?w=1200",
        })

        if (error) {
            console.error(error)
            // Check for Unique Constraint on Slug
            if (error.code === '23505') {
                return {
                    errors: {
                        slug: ['Ce slug est déjà utilisé. Veuillez en choisir un autre.']
                    }
                }
            }
            throw error
        }
    } catch (error) {
        return {
            message: 'Une erreur est survenue lors de la création du serveur.',
        }
    }

    revalidatePath('/dashboard')
    redirect('/dashboard')
}

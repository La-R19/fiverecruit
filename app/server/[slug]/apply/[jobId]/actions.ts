
"use server"

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export async function submitApplication(jobId: string, answers: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error("Must be logged in")
    }

    // Fetch Job to get Server ID and Webhook URL
    const { data: job } = await supabase.from('jobs').select('server_id, title, discord_webhook_url').eq('id', jobId).single()
    if (!job) throw new Error("Job not found")

    const { error } = await supabase.from('applications').insert({
        job_id: jobId,
        server_id: job.server_id,
        candidate_id: user.id,
        answers: answers,
        status: 'pending'
    })

    if (error) {
        console.error(error)
        throw new Error("Erreur lors de l'envoi")
    }

    // Trigger Webhook (Fire and Forget logic mostly, or simple await)
    if (job.discord_webhook_url) {
        try {
            await fetch(job.discord_webhook_url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: "Nouvelle candidature reçue ! 📬",
                    embeds: [
                        {
                            title: `Candidature : ${job.title}`,
                            description: `**Candidat :** <@${user.user_metadata.provider_id || 'Inconnu'}> (${user.user_metadata.full_name || user.email})\n**Statut :** En attente`,
                            color: 5814783, // Blue-ish
                            fields: [
                                {
                                    name: "Action",
                                    value: `[Voir la candidature](https://fiverecruit.com/dashboard/server/${job.server_id}/applications)`
                                }
                            ],
                            timestamp: new Date().toISOString()
                        }
                    ]
                })
            })
        } catch (webhookError) {
            console.error("Failed to send webhook", webhookError)
            // Do not block the success response for the user
        }
    }

    return { success: true }
}


"use server"

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export async function submitApplication(jobId: string, answers: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error("Must be logged in")
    }

    // Fetch Job to get Server ID
    const { data: job } = await supabase.from('jobs').select('server_id').eq('id', jobId).single()
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

    return { success: true }
}


import { createClient } from "@/utils/supabase/server"
import { notFound, redirect } from "next/navigation"
import { FormBuilder } from "./form-builder"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { checkPermission } from "@/utils/permissions"

export default async function BuilderPage(props: { params: Promise<{ serverId: string; jobId: string }> }) {
    const params = await props.params;
    const { serverId, jobId } = params
    const supabase = await createClient()

    // Fetch Job and Verify Ownership
    const { data: job } = await supabase
        .from('jobs')
        .select('*, servers(*)')
        .eq('id', jobId)
        .single()

    if (!job) notFound()

    // Verify User (Optional: Add more rigorous check if servers(*) join returned data)
    // Verify User Permissions
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const hasAccess = await checkPermission(serverId, 'can_edit_jobs', { jobId })

    if (!hasAccess) {
        redirect('/dashboard')
    }

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] -m-6">
            <header className="border-b bg-white px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={`/dashboard/server/${serverId}`}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="font-semibold">{job.title}</h1>
                        <p className="text-xs text-muted-foreground">Éditeur de formulaire</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {/* Actions for the builder will be inside the client component mainly, 
                but we could have a global 'Save' here if we lifted state up. 
                For now, let FormBuilder handle saving. */}
                </div>
            </header>

            <div className="flex-1 overflow-hidden">
                <FormBuilder initialSchema={job.form_schema || []} jobId={jobId} serverId={serverId} />
            </div>
        </div>
    )
}

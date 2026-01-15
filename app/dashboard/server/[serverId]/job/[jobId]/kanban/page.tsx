
import { createClient } from "@/utils/supabase/server"
import { notFound, redirect } from "next/navigation"
import { KanbanBoard } from "./kanban-board"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { checkPermission } from "@/utils/permissions"

import { Badge } from "@/components/ui/badge"

export default async function KanbanPage(props: { params: Promise<{ serverId: string; jobId: string }> }) {
    const params = await props.params;
    const { serverId, jobId } = params
    const supabase = await createClient()

    const { data: job } = await supabase
        .from('jobs')
        .select('*, servers(*)')
        .eq('id', jobId)
        .single()

    if (!job) notFound()

    const canView = await checkPermission(serverId, 'can_view_applications', { jobId })
    if (!canView) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-xl font-bold text-red-500">Accès Restreint</h1>
                <p>Vous n'avez pas la permission de voir les candidatures.</p>
                <Link href={`/dashboard/server/${serverId}`}>
                    <Button variant="link">Retour</Button>
                </Link>
            </div>
        )
    }

    // Fetch Applications
    const { data: applications } = await supabase
        .from('applications')
        .select('*, profiles(username, avatar_url)')
        .eq('job_id', jobId)
        .order('created_at', { ascending: false })

    const canManage = await checkPermission(serverId, 'can_manage_applications', { jobId })
    const canDelete = await checkPermission(serverId, 'can_delete_applications', { jobId })

    if (!job) {
        return <div>Erreur de chargement</div>
    }

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] -m-6">
            <div className="border-b bg-white px-6 py-4 flex items-center justify-between shadow-sm z-10">
                <div>
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        {job.title}
                        <Badge variant="outline" className="font-normal text-gray-500">
                            {applications?.length || 0} candidatures
                        </Badge>
                    </h1>
                </div>
            </div>

            <div className="flex-1 overflow-hidden bg-gray-100/50 p-6">
                <KanbanBoard
                    initialData={applications || []}
                    jobId={jobId}
                    formSchema={job.form_schema || []}
                    canDelete={canDelete}
                />
            </div>
        </div>
    )
}

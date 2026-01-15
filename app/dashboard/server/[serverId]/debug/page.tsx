
import { createClient } from "@/utils/supabase/server"

export default async function DebugPage(props: { params: Promise<{ serverId: string }> }) {
    const params = await props.params;
    const { serverId } = params
    const supabase = await createClient()

    const { data: applications } = await supabase
        .from('applications')
        .select('*, jobs(title, form_schema)')
        .eq('server_id', serverId)
        .order('created_at', { ascending: false })
        .limit(5)

    return (
        <div className="p-8 space-y-4">
            <h1 className="text-2xl font-bold">Database Debug Inspector</h1>
            <p className="text-muted-foreground">Viewing last 5 applications for Server ID: {serverId}</p>

            {applications?.map(app => (
                <div key={app.id} className="border p-4 rounded-lg bg-gray-50 font-mono text-xs">
                    <h3 className="font-bold text-sm mb-2">App ID: {app.id} | Job: {(app.jobs as any)?.title}</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="font-semibold">Status:</span> {app.status}
                        </div>
                        <div>
                            <span className="font-semibold">Candidate:</span> {app.candidate_id}
                        </div>
                    </div>
                    <div className="mt-4 bg-gray-900 text-green-400 p-4 rounded overflow-auto">
                        <div className="mb-1 text-gray-500">// 'answers' column content:</div>
                        {JSON.stringify(app.answers, null, 2)}
                    </div>
                    <div className="mt-4 bg-gray-900 text-blue-400 p-4 rounded overflow-auto">
                        <div className="mb-1 text-gray-500">// Job Schema:</div>
                        {JSON.stringify((app.jobs as any)?.form_schema, null, 2)}
                    </div>
                </div>
            ))}

            {(!applications || applications.length === 0) && (
                <div className="text-red-500">No applications found in database.</div>
            )}
        </div>
    )
}

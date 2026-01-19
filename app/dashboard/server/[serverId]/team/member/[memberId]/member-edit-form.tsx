
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { updateMember } from "./actions"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { DEFAULT_PERMISSIONS } from "@/utils/permissions-types"

const PERMISSION_LABELS: Record<string, string> = {
    can_create_jobs: "Créer des offres",
    can_edit_jobs: "Modifier les offres",
    can_delete_jobs: "Supprimer les offres",
    can_view_applications: "Voir les candidatures",
    can_manage_applications: "Traiter les candidatures",
    can_delete_applications: "Supprimer les candidatures",
    can_edit_server: "Modifier le serveur",
    can_manage_team: "Gérer l'équipe",
    can_view_stats: "Voir les stats",
    can_manage_subscription: "Gérer l'abonnement"
};

export function MemberEditForm({ serverId, memberId, initialData, jobs, serverRolePermissions }: any) {
    const [role, setRole] = useState(initialData.role)
    const [jobId, setJobId] = useState(initialData.job_id || "all")
    const [permissions, setPermissions] = useState(initialData.specific_permissions || {})
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    // Helper to get effective permission (for display maybe?)
    // No, we want to allow override.

    const handlePermissionChange = (key: string, checked: boolean) => {
        setPermissions((prev: any) => ({ ...prev, [key]: checked }))
    }

    async function handleSave() {
        setLoading(true)
        try {
            await updateMember(serverId, memberId, {
                role,
                job_id: jobId,
                specific_permissions: permissions
            })
            router.refresh()
            // Optional: Show success message/toast
            alert("Modifications enregistrées !")
        } catch (error) {
            console.error(error)
            alert("Erreur de sauvegarde")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Rôle & Accès</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Rôle</Label>
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">Administrateur</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="viewer">Observateur</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Accès restreint à une offre (Optionnel)</Label>
                        <Select value={jobId || "all"} onValueChange={setJobId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Accès Global" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Accès Global (Toutes les offres)</SelectItem>
                                {jobs.map((job: any) => (
                                    <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">Si sélectionné, l'utilisateur ne pourra voir que les candidatures de cette offre.</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Permissions Spécifiques</CardTitle>
                    <CardDescription>Cochez pour surcharger les permissions par défaut du rôle.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    {Object.keys(DEFAULT_PERMISSIONS.manager).map((key) => {
                        // Determine default from role
                        // If role is admin -> default true
                        // If role is manager -> get from server settings OR default
                        const roleSettings = serverRolePermissions[role] || DEFAULT_PERMISSIONS.manager;
                        const defaultVal = role === 'admin' ? true : role === 'viewer' ? false : (roleSettings[key] ?? false);

                        const effectiveVal = permissions[key] !== undefined ? permissions[key] : defaultVal;

                        return (
                            <div key={key} className="flex items-center space-x-2 border p-3 rounded hover:bg-gray-50">
                                <Checkbox
                                    id={key}
                                    checked={effectiveVal}
                                    onCheckedChange={(c) => handlePermissionChange(key, c as boolean)}
                                />
                                <div className="flex-1">
                                    <Label htmlFor={key} className="cursor-pointer font-medium">
                                        {PERMISSION_LABELS[key] || key}
                                    </Label>
                                    {permissions[key] !== undefined && (
                                        <p className="text-xs text-purple-600 font-semibold">Modifié manuellement</p>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </CardContent>
            </Card>

            <Button onClick={handleSave} disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sauvegarder les modifications
            </Button>
        </div>
    )
}

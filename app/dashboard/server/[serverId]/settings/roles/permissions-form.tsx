
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { updateRolePermissions } from "./actions"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface PermissionsFormProps {
    serverId: string;
    initialPermissions: Record<string, boolean>;
}

const PERMISSION_LABELS: Record<string, string> = {
    can_create_jobs: "Créer des offres d'emploi",
    can_edit_jobs: "Modifier les offres d'emploi",
    can_delete_jobs: "Supprimer les offres d'emploi",
    can_view_applications: "Voir les candidatures",
    can_manage_applications: "Gérer les candidatures (changer statut)",
    can_delete_applications: "Supprimer les candidatures",
    can_edit_server: "Modifier les infos du serveur",
    can_manage_team: "Gérer l'équipe (inviter/exclure)",
    can_view_stats: "Voir les statistiques",
    can_manage_subscription: "Gérer l'abonnement (paiements, factures)",
    can_delete_server: "Supprimer le serveur (⚠️ Zone de danger)"
};

export function PermissionsForm({ serverId, initialPermissions }: PermissionsFormProps) {
    const [permissions, setPermissions] = useState(initialPermissions)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSave() {
        setLoading(true)
        try {
            await updateRolePermissions(serverId, permissions)
            router.refresh()
        } catch (error) {
            console.error(error)
            alert("Erreur lors de la sauvegarde")
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (key: string, checked: boolean) => {
        setPermissions(prev => ({ ...prev, [key]: checked }))
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4">
                {Object.keys(initialPermissions).map((key) => (
                    <div key={key} className="flex items-center space-x-2 border p-3 rounded hover:bg-gray-50">
                        <Checkbox
                            id={key}
                            checked={permissions[key]}
                            onCheckedChange={(c) => handleChange(key, c as boolean)}
                        />
                        <Label htmlFor={key} className="flex-1 cursor-pointer font-medium">
                            {PERMISSION_LABELS[key] || key}
                        </Label>
                    </div>
                ))}
            </div>

            <Button onClick={handleSave} disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enregistrer les permissions
            </Button>
        </div>
    )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateServer } from "./actions"
import { deleteServer } from "./delete-server-action"
import { useRouter } from "next/navigation"

export function ServerSettingsForm({ server, canDelete = false, canEdit = true }: { server: any, canDelete?: boolean, canEdit?: boolean }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    // Simple state management
    const [formData, setFormData] = useState({
        name: server.name || '',
        slug: server.slug || '',
        description: server.description || '',
        cover_image_url: server.cover_image_url || '',
        discord_invite_url: server.discord_invite_url || ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await updateServer(server.id, formData)
            router.refresh()
            alert("Sauvegardé avec succès !")
        } catch (e: any) {
            alert(e.message || "Erreur lors de la sauvegarde")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Nom du Serveur</Label>
                    <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Ex: MyRP Server"
                        disabled={!canEdit}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="slug">URL Publique (Slug)</Label>
                    <div className={`flex items-center gap-2 text-sm text-muted-foreground bg-gray-50 px-3 py-2 rounded-md border ${!canEdit ? 'opacity-60' : ''}`}>
                        <span>fiverecruit.com/server/</span>
                        <input
                            className="bg-transparent border-none focus:outline-none flex-1 font-medium text-black"
                            id="slug"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            required
                            disabled={!canEdit}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground">Identifiant unique pour votre page publique.</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Décrivez votre serveur..."
                        disabled={!canEdit}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="cover_image_url">Image de couverture (URL)</Label>
                    <Input
                        id="cover_image_url"
                        name="cover_image_url"
                        value={formData.cover_image_url}
                        onChange={handleChange}
                        placeholder="https://..."
                        disabled={!canEdit}
                    />
                    <p className="text-xs text-muted-foreground">Lien direct vers une image (jpg, png).</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="discord_invite_url">Lien Discord</Label>
                    <Input
                        id="discord_invite_url"
                        name="discord_invite_url"
                        value={formData.discord_invite_url}
                        onChange={handleChange}
                        placeholder="https://discord.gg/..."
                        disabled={!canEdit}
                    />
                </div>

                {canEdit && (
                    <div className="pt-4 flex justify-end">
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Sauvegarde...' : 'Enregistrer les modifications'}
                        </Button>
                    </div>
                )}
            </form>

            {canDelete && (
                <div className="mt-12 pt-8 border-t border-red-100">
                    <div className="bg-red-50/50 border border-red-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-red-900 mb-2">Zone de Danger</h3>
                        <p className="text-sm text-red-700 mb-6">
                            La suppression d'un serveur est irréversible. Toutes les données (candidatures, membres, configurations) seront effacées.
                            <br />
                            <strong>Note :</strong> Si une licence active est liée à ce serveur, elle sera automatiquement détachée et retournée dans votre inventaire pour être réutilisée.
                        </p>

                        <DeleteServerButton serverId={server.id} />
                    </div>
                </div>
            )}
        </>
    )
}

function DeleteServerButton({ serverId }: { serverId: string }) {
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        if (!confirm("⚠️ ATTENTION : Êtes-vous sûr de vouloir supprimer ce serveur ?\n\nCette action est irréversible.\nVotre licence sera sauvegardée.")) return

        setLoading(true)
        try {
            await deleteServer(serverId)
        } catch (error: any) {
            if (error.message === 'NEXT_REDIRECT' || error.digest?.startsWith('NEXT_REDIRECT')) {
                return // Redirecting...
            }
            alert(error.message)
            setLoading(false)
        }
    }

    return (
        <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "Suppression..." : "Supprimer ce serveur définitivement"}
        </Button>
    )
}

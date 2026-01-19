"use client"

import { useFormStatus } from "react-dom"
import { updateJob } from "../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Briefcase, Shield, FileText } from "lucide-react"
import { useFormState } from "react-dom"
import { useState } from "react"
import { DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

const initialState = {
    message: null,
    success: false
}

import { deleteJob } from "../actions"

export function EditJobForm({ job, serverId, onClose, canDelete = false }: { job: any, serverId: string, onClose?: () => void, canDelete?: boolean }) {
    const updateJobWithId = updateJob.bind(null, job.id, serverId)
    // @ts-ignore
    const [state, formAction] = useFormState(updateJobWithId, initialState)
    const [whitelist, setWhitelist] = useState(job.whitelist_required || false)

    if (state.success) {
        if (onClose) setTimeout(onClose, 500)
    }

    return (
        <>
            <form action={formAction} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="title">Titre du poste</Label>
                    <Input id="title" name="title" defaultValue={job.title} required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description courte</Label>
                    <Textarea
                        id="description"
                        name="description"
                        defaultValue={job.description}
                        placeholder="Ce poste nécessite..."
                        className="resize-none"
                        rows={3}
                    />
                    <p className="text-xs text-muted-foreground">Une brève description affichée sur la fiche du poste.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="contractType">Type de contrat</Label>
                        <Select name="contractType" defaultValue={job.contract_type || "Temps plein"}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Temps plein">Temps plein</SelectItem>
                                <SelectItem value="Temps partiel">Temps partiel</SelectItem>
                                <SelectItem value="Freelance">Freelance</SelectItem>
                                <SelectItem value="Bénévolat">Bénévolat</SelectItem>
                                <SelectItem value="Stage">Stage</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="icon">Icône du poste</Label>
                        <Select name="icon" defaultValue={job.icon || "Briefcase"}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choisir une icône" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Briefcase">💼 Mallette (Défaut)</SelectItem>
                                <SelectItem value="Shield">🛡️ Police/Sécurité</SelectItem>
                                <SelectItem value="Stethoscope">🩺 Médical</SelectItem>
                                <SelectItem value="Car">🚗 Mécano/Vente</SelectItem>
                                <SelectItem value="Gavel">⚖️ Justice</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label className="text-base">Whitelist Requise</Label>
                        <p className="text-sm text-muted-foreground">
                            Restreindre ce job aux joueurs whitelistés.
                        </p>
                    </div>
                    <Switch
                        name="whitelistRequired"
                        checked={whitelist}
                        onCheckedChange={setWhitelist}
                    />
                    {/* Switch doesn't submit value clearly in form data sometimes without hidden input if using Shadcn switch which is controlled */}
                    <input type="hidden" name="whitelistRequired" value={whitelist ? 'on' : 'off'} />
                </div>

                {state?.message && !state.success && (
                    <p className="text-sm text-red-500">{state.message}</p>
                )}

                {state?.success && (
                    <p className="text-sm text-green-500">Modifications enregistrées !</p>
                )}

                <DialogFooter className="flex justify-between items-center w-full">
                    {/* Empty div for spacing if button is floated right, or put delete button here */}
                    <div />
                    <SubmitButton />
                </DialogFooter>
            </form>

            {canDelete && (
                <div className="mt-6 pt-4 border-t flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                        Zone de danger
                    </div>
                    <DeleteJobButton jobId={job.id} serverId={serverId} />
                </div>
            )}
        </>
    )
}

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enregistrer
        </Button>
    )
}

function DeleteJobButton({ jobId, serverId }: { jobId: string, serverId: string }) {
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        if (!confirm("Voulez-vous vraiment supprimer ce poste ?\nToutes les candidatures associées seront supprimées.")) return
        setLoading(true)
        try {
            await deleteJob(jobId, serverId)
            // Dialog should accept closing from parent revalidation or we can force close if passed?
            // Revalidation will unmount this likely if list changes? No, dialog might stay open if state based.
            // But revalidatePath usually refreshes the page content.
        } catch (error) {
            alert("Erreur")
            setLoading(false)
        }
    }

    return (
        <Button variant="destructive" size="sm" type="button" onClick={handleDelete} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Supprimer le poste"}
        </Button>
    )
}

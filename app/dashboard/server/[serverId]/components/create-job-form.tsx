
"use client"

import { useFormStatus } from "react-dom"
import { createJob } from "../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useFormState } from "react-dom"
import { useEffect, useState } from "react"
import { DialogFooter } from "@/components/ui/dialog"

// Initial state for server action
const initialState = {
    message: null,
    success: false
}

export function CreateJobForm({ serverId }: { serverId: string }) {
    // @ts-ignore
    const [state, formAction] = useFormState(createJob, initialState)
    const [open, setOpen] = useState(true) // Controlled via parent ideally, but for now simple inner logic? 
    // actually Dialog in parent controls visibility. We just need to give feedback.

    return (
        <form action={formAction} className="space-y-4">
            <input type="hidden" name="serverId" value={serverId} />

            <div className="space-y-2">
                <Label htmlFor="title">Titre du poste</Label>
                <Input id="title" name="title" placeholder="Ex: Officier LSPD" required />
                {state?.errors?.title && (
                    <p className="text-sm text-red-500">{state.errors.title}</p>
                )}
            </div>

            {state?.message && !state.success && (
                <p className="text-sm text-red-500">{state.message}</p>
            )}

            {state?.success && (
                <p className="text-sm text-green-500">Poste créé avec succès !</p>
            )}

            <DialogFooter>
                <SubmitButton />
            </DialogFooter>
        </form>
    )
}

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Créer
        </Button>
    )
}

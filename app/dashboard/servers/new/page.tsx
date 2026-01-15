
"use client"

import { useActionState } from "react"
import { createServer } from "../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

const initialState = {
    message: null,
    errors: {},
}

export default function NewServerPage() {
    // @ts-ignore - useActionState types are tricky sometimes
    const [state, formAction] = useActionState(createServer, initialState)

    return (
        <div className="flex justify-center items-start min-h-[80vh] pt-10">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle>Créer votre espace</CardTitle>
                    <CardDescription>Configurez votre serveur FiveM pour recevoir des candidatures.</CardDescription>
                </CardHeader>
                <form action={formAction} className="flex flex-col gap-6">
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nom du Serveur</Label>
                            <Input id="name" name="name" placeholder="Ex: Los Santos Roleplay" required />
                            {state?.errors?.name && <p className="text-sm text-red-500">{state.errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">URL Personnalisée (Slug)</Label>
                            <div className="flex items-center">
                                <span className="bg-gray-100 border border-r-0 rounded-l-md px-3 py-2 text-sm text-gray-500">fiverecruit.com/</span>
                                <Input id="slug" name="slug" placeholder="mon-serveur" className="rounded-l-none" required />
                            </div>
                            {state?.errors?.slug && <p className="text-sm text-red-500">{state.errors.slug}</p>}
                            <p className="text-xs text-muted-foreground">Ce sera le lien public pour vos candidats.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description courte</Label>
                            <Textarea id="description" name="description" placeholder="Le meilleur serveur de France..." />
                            {state?.errors?.description && <p className="text-sm text-red-500">{state.errors.description}</p>}
                        </div>

                        {state?.message && (
                            <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm">
                                {state.message}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <SubmitButton />
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

import { useFormStatus } from "react-dom"

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {pending ? "Création..." : "Créer le serveur"}
        </Button>
    )
}

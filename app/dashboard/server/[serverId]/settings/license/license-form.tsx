"use client"

import { useActionState, useState } from "react"
import { activateLicense } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Key, CheckCircle2, AlertCircle } from "lucide-react"

const initialState = {
    message: null,
    success: false,
    plan: null
}

export function LicenseForm({ serverId, currentPlan = "free", maxJobs = 1 }: { serverId: string, currentPlan?: string, maxJobs?: number }) {
    // @ts-ignore
    const [state, formAction] = useActionState((prevState, formData) => {
        const key = formData.get('licenseKey') as string
        return activateLicense(key, serverId)
    }, initialState)

    return (
        <Card className="border-indigo-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-indigo-50/30 border-b border-indigo-50">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                            <Key className="h-5 w-5 text-indigo-600" />
                            Licence & Abonnement
                        </CardTitle>
                        <CardDescription>
                            Gérez votre plan et vos limites.
                        </CardDescription>
                    </div>
                    <Badge variant={currentPlan === 'free' ? "outline" : "default"} className={`capitalize ${currentPlan !== 'free' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}`}>
                        Plan {currentPlan}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">

                {/* Current Usage Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <span className="text-xs font-medium text-gray-500 uppercase">Limite d'offres</span>
                        <div className="text-2xl font-bold text-gray-900 mt-1">{maxJobs}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <span className="text-xs font-medium text-gray-500 uppercase">Validité</span>
                        <div className="text-2xl font-bold text-gray-900 mt-1">
                            {currentPlan === 'free' ? 'Illimitée' : '30 jours'}
                        </div>
                    </div>
                </div>

                {currentPlan === 'free' ? (
                    <div className="space-y-4 pt-4 border-t">
                        <div className="space-y-2">
                            <Label htmlFor="licenseKey">Activer une clé Premium</Label>
                            <form action={formAction} className="flex gap-2">
                                <Input
                                    id="licenseKey"
                                    name="licenseKey"
                                    placeholder="XXXX-XXXX-XXXX-XXXX"
                                    className="font-mono uppercase"
                                    required
                                />
                                <SubmitButton />
                            </form>
                            <p className="text-xs text-muted-foreground">
                                Entrez la clé fournie par le bot Discord pour débloquer les fonctionnalités.
                            </p>
                        </div>

                        {state?.message && !state.success && (
                            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                                <AlertCircle className="h-4 w-4" />
                                {state.message}
                            </div>
                        )}

                        {state?.success && (
                            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-md">
                                <CheckCircle2 className="h-4 w-4" />
                                {state.message}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-green-900 text-sm">Licence Active</h4>
                            <p className="text-green-700 text-sm mt-1">
                                Votre serveur bénéficie des fonctionnalités Premium. Profitez-en !
                            </p>
                        </div>
                    </div>
                )}

            </CardContent>
        </Card>
    )
}

function SubmitButton() {
    // We need to use useFormStatus inside a component rendered inside the form
    // Since we are using standard form action, checking pending status via hook
    // But wait, useFormStatus must be inside the form element as a child.
    // The Input + Button are children of form. So this needs to be a component.
    return <StatusButton />
}

import { useFormStatus } from "react-dom"

function StatusButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending} className="whitespace-nowrap">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Activer"}
        </Button>
    )
}

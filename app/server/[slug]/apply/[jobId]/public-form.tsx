
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { submitApplication } from "./actions"
import { Loader2, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function PublicApplicationForm({ jobId, schema, userId }: { jobId: string, schema: any[], userId: string }) {
    const [answers, setAnswers] = useState<Record<string, any>>({})
    const [submitting, setSubmitting] = useState(false)
    const [completed, setCompleted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            await submitApplication(jobId, answers)
            setCompleted(true)
        } catch (error) {
            alert("Erreur lors de l'envoi.")
            setSubmitting(false)
        }
    }

    const handleChange = (id: string, value: any) => {
        setAnswers(prev => ({ ...prev, [id]: value }))
    }

    if (completed) {
        return (
            <div className="text-center py-12 space-y-4 animate-in fade-in zoom-in duration-500">
                <div className="bg-green-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto text-green-600">
                    <CheckCircle2 className="h-10 w-10" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Candidature Envoyée !</h2>
                <p className="text-muted-foreground">Le staff étudiera votre dossier prochainement.</p>
                <Button onClick={() => window.history.back()} variant="outline" className="mt-4">
                    Retour au serveur
                </Button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {schema.map((field) => (
                <div key={field.id} className="space-y-3">
                    <Label className="text-base font-medium">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>

                    {field.type === 'text' && (
                        <Input
                            required={field.required}
                            placeholder={field.placeholder}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                        />
                    )}

                    {field.type === 'textarea' && (
                        <Textarea
                            required={field.required}
                            placeholder={field.placeholder}
                            className="min-h-[120px]"
                            onChange={(e) => handleChange(field.id, e.target.value)}
                        />
                    )}

                    {field.type === 'number' && (
                        <Input
                            type="number"
                            required={field.required}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                        />
                    )}

                    {field.type === 'select' && (
                        <Select required={field.required} onValueChange={(val) => handleChange(field.id, val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez une option" />
                            </SelectTrigger>
                            <SelectContent>
                                {field.options?.map((opt: string) => (
                                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

                    {field.type === 'checkbox' && (
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id={field.id}
                                required={field.required}
                                onCheckedChange={(checked) => handleChange(field.id, checked)}
                            />
                            <Label htmlFor={field.id} className="font-normal text-muted-foreground">Oui, je confirme.</Label>
                        </div>
                    )}
                </div>
            ))}

            <Button type="submit" size="lg" className="w-full text-lg h-12" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Envoyer ma candidature
            </Button>
        </form>
    )
}

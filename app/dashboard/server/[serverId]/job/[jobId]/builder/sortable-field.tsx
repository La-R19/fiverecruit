
"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { FormField } from "./types"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { GripVertical, Trash2 } from "lucide-react"

interface SortableFieldProps {
    field: FormField
    onDelete: (id: string) => void
    onUpdate: (id: string, updates: Partial<FormField>) => void
}

export function SortableField({ field, onDelete, onUpdate }: SortableFieldProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: field.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <Card ref={setNodeRef} style={style} className="relative group bg-white">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 cursor-move text-gray-300 hover:text-gray-600 p-2" {...attributes} {...listeners}>
                <GripVertical className="h-5 w-5" />
            </div>

            <div className="pl-12 pr-4 py-4 flex flex-col gap-4">
                <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-2">
                        <Label className="text-xs text-muted-foreground uppercase">Label de la question</Label>
                        <Input
                            value={field.label}
                            onChange={(e) => onUpdate(field.id, { label: e.target.value })}
                            className="font-medium"
                        />
                    </div>

                    <div className="flex items-center gap-2 pt-6">
                        <div className="flex items-center space-x-2">
                            <Switch
                                id={`req-${field.id}`}
                                checked={field.required}
                                onCheckedChange={(checked) => onUpdate(field.id, { required: checked })}
                            />
                            <Label htmlFor={`req-${field.id}`}>Obligatoire</Label>
                        </div>

                        <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-500 hover:bg-red-50" onClick={() => onDelete(field.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Type specific config */}
                {field.type === 'select' && (
                    <div className="space-y-2 pl-1 border-l-2 border-dashed">
                        <Label className="text-xs">Options (Séparées par des virgules)</Label>
                        <Input
                            value={field.options?.join(', ') || ''}
                            onChange={(e) => onUpdate(field.id, { options: e.target.value.split(',').map(s => s.trim()) })}
                            placeholder="Option 1, Option 2, ..."
                        />
                    </div>
                )}
            </div>
        </Card>
    )
}

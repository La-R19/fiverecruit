
"use client"

import { useState } from "react"
import { DndContext, DragOverlay, useDraggable, useDroppable, DragStartEvent, DragEndEvent, useSensor, useSensors, PointerSensor, closestCenter } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable"
import { FormField, FieldType, FIELD_TYPES } from "./types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Save, Plus, ArrowRight, Type, AlignLeft, Hash, List, CheckSquare } from "lucide-react"
import { SortableField } from "./sortable-field"
import { updateJobSchema } from "./actions"

// Helper for icons
const iconMap: Record<string, any> = {
    Type, AlignLeft, Hash, List, CheckSquare
}

export function FormBuilder({ initialSchema, jobId, serverId }: { initialSchema: FormField[], jobId: string, serverId: string }) {
    const [fields, setFields] = useState<FormField[]>(initialSchema)
    const [saving, setSaving] = useState(false)
    const [activeId, setActiveId] = useState<string | null>(null)

    const generateId = () => Math.random().toString(36).substring(2, 9)

    // Simplified sensors for reordering
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    )

    // ADD VIA CLICK (Robust & Fast)
    const addField = (type: FieldType) => {
        const newItem: FormField = {
            id: generateId(),
            type,
            label: `Nouvelle question ${type === 'text' ? '(Texte)' : ''}`,
            required: false,
            placeholder: '',
            options: type === 'select' ? ['Option 1', 'Option 2'] : undefined
        }
        setFields((items) => [...items, newItem])
    }

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        setActiveId(null)

        if (active.id !== over?.id) {
            setFields((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id)
                const newIndex = items.findIndex((i) => i.id === over?.id)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    const handleDelete = (id: string) => {
        setFields(fields.filter(f => f.id !== id))
    }

    const handleUpdate = (id: string, updates: Partial<FormField>) => {
        setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f))
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            await updateJobSchema(jobId, fields)
            alert("Sauvegardé !")
        } catch (e) {
            alert("Erreur de sauvegarde")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="flex h-full">
            {/* Sidebar (Tools) - Click to Add */}
            <aside className="w-64 border-r bg-gray-50/50 p-4 overflow-y-auto hidden md:block">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Éléments</h3>
                    <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Clic pour ajouter</span>
                </div>

                <div className="space-y-2">
                    {FIELD_TYPES.map((item) => {
                        const Icon = iconMap[item.icon] || Hash
                        return (
                            <Button
                                key={item.type}
                                variant="outline"
                                className="w-full justify-start gap-3 h-auto py-3 bg-white hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all group"
                                onClick={() => addField(item.type)}
                            >
                                <Icon className="h-4 w-4 text-gray-500 group-hover:text-blue-500" />
                                <span className="font-medium">{item.label}</span>
                                <Plus className="ml-auto h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Button>
                        )
                    })}
                </div>

                <div className="mt-8 pt-4 border-t">
                    <Button onClick={handleSave} className="w-full" disabled={saving}>
                        <Save className="mr-2 h-4 w-4" />
                        {saving ? '...' : 'Sauvegarder'}
                    </Button>
                </div>
            </aside>

            {/* Canvas - Drag to Sort */}
            <main className="flex-1 bg-gray-100/50 p-8 overflow-y-auto">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className="max-w-2xl mx-auto space-y-4 pb-20">
                        {fields.length === 0 ? (
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center bg-white/50">
                                <div className="mx-auto bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                    <Plus className="h-6 w-6 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">Formulaire vide</h3>
                                <p className="text-gray-500 mt-1 mb-6">Commencez par ajouter des questions depuis le menu.</p>
                                {/* Mobile/Fallback buttons if needed */}
                                <div className="grid grid-cols-2 gap-2 md:hidden">
                                    {FIELD_TYPES.slice(0, 4).map(t => (
                                        <Button key={t.type} size="sm" variant="outline" onClick={() => addField(t.type)}>+ {t.label}</Button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <SortableContext items={fields} strategy={verticalListSortingStrategy}>
                                <div className="space-y-4">
                                    {fields.map((field) => (
                                        <SortableField
                                            key={field.id}
                                            field={field}
                                            onDelete={handleDelete}
                                            onUpdate={handleUpdate}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        )}
                    </div>

                    <DragOverlay>
                        {activeId ? (
                            <div className="bg-white p-4 rounded-xl shadow-2xl border-2 border-blue-500 opacity-90">
                                <span className="font-medium text-blue-700">Déplacement de la question...</span>
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </main>
        </div>
    )
}

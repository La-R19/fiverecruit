
"use client"

import { useState } from "react"
import {
    DndContext,
    DragOverlay,
    useDraggable,
    useDroppable,
    DragStartEvent,
    DragEndEvent,
    useSensor,
    useSensors,
    PointerSensor
} from "@dnd-kit/core"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trash2, Eye } from "lucide-react"
import { deleteApplication, updateApplicationStatus } from "./actions"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

type Application = any // Using any for MVP speed, ideally proper types
type Status = 'pending' | 'interview' | 'accepted' | 'rejected'

const COLUMNS: { id: Status; label: string; color: string }[] = [
    { id: 'pending', label: 'En attente', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-200' },
    { id: 'interview', label: 'Entretien', color: 'bg-blue-500/10 text-blue-500 border-blue-200' },
    { id: 'accepted', label: 'Accepté', color: 'bg-green-500/10 text-green-500 border-green-200' },
    { id: 'rejected', label: 'Refusé', color: 'bg-red-500/10 text-red-500 border-red-200' },
]

export function KanbanBoard({ initialData, jobId, formSchema, canDelete = false }: { initialData: Application[], jobId: string, formSchema: any[], canDelete?: boolean }) {
    const [applications, setApplications] = useState<Application[]>(initialData)
    const [activeId, setActiveId] = useState<string | null>(null)
    const [selectedApp, setSelectedApp] = useState<Application | null>(null)

    // Fix click vs drag conflict: Drag only starts after moving 5px
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    )

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string)
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        setActiveId(null)

        if (!over) return

        const appId = active.id as string
        const newStatus = over.id as Status

        // Optimistic update
        const oldApp = applications.find(a => a.id === appId)
        if (!oldApp || oldApp.status === newStatus) return

        setApplications(apps => apps.map(a =>
            a.id === appId ? { ...a, status: newStatus } : a
        ))

        try {
            await updateApplicationStatus(appId, newStatus)
        } catch (error) {
            // Revert on error
            setApplications(apps => apps.map(a =>
                a.id === appId ? { ...a, status: oldApp.status } : a
            ))
            alert("Erreur de mise à jour")
        }
    }

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex h-full gap-6 overflow-x-auto pb-4">
                {COLUMNS.map(col => (
                    <KanbanColumn
                        key={col.id}
                        column={col}
                        applications={applications.filter(a => a.status === col.id)}
                        onClickApp={setSelectedApp}
                    />
                ))}
            </div>

            <DragOverlay>
                {activeId ? (
                    <div className="w-[300px] opacity-80 rotate-2 cursor-grabbing">
                        <Card className="shadow-xl">
                            <CardHeader className="p-4">
                                <CardTitle className="text-sm">Déplacement...</CardTitle>
                            </CardHeader>
                        </Card>
                    </div>
                ) : null}
            </DragOverlay>

            <ApplicationDetails
                app={selectedApp}
                open={!!selectedApp}
                onClose={() => setSelectedApp(null)}
                schema={formSchema}
                canDelete={canDelete}
            />
        </DndContext>
    )
}

// Helper for time ago
function timeAgo(dateString: string) {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `À l'instant`
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} h`
    if (diffInSeconds < 604800) return `Il y a ${Math.floor(diffInSeconds / 86400)} j`
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

function KanbanColumn({ column, applications, onClickApp }: { column: any, applications: any[], onClickApp: (app: any) => void }) {
    const { setNodeRef } = useDroppable({ id: column.id })

    return (
        <div ref={setNodeRef} className="flex-1 min-w-[300px] flex flex-col gap-4 group/col">
            <div className={`p-3 rounded-lg border flex items-center justify-between ${column.color}`}>
                <span className="font-semibold text-sm uppercase tracking-wide">{column.label}</span>
                <Badge variant="secondary" className="bg-white/50">{applications.length}</Badge>
            </div>

            <div className={`flex-1 flex flex-col gap-3 min-h-[150px] rounded-xl transition-colors ${applications.length === 0 ? 'bg-gray-50/50 border-2 border-dashed border-gray-200 hover:border-gray-300' : ''}`}>
                {applications.length > 0 ? (
                    applications.map(app => (
                        <DraggableCard key={app.id} app={app} onClick={() => onClickApp(app)} />
                    ))
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2 p-4">
                        <div className="w-8 h-1 rounded-full bg-gray-200"></div>
                        <span className="text-xs font-medium">Vide</span>
                    </div>
                )}
            </div>
        </div>
    )
}

function DraggableCard({ app, onClick }: { app: any, onClick: () => void }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: app.id })

    if (isDragging) {
        return <div ref={setNodeRef} className="h-24 bg-gray-100 rounded-xl border-2 border-dashed" />
    }

    return (
        <Card
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            // Removing onClick from here to avoid conflicts, handled by button or specialized click area
            className="group relative cursor-grab hover:shadow-md transition-all active:cursor-grabbing hover:border-blue-200"
        >
            <CardHeader className="p-4 space-y-0">
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={app.profiles?.avatar_url} />
                        <AvatarFallback>{(app.profiles?.username?.[0] || 'C').toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden flex-1">
                        <CardTitle className="text-sm font-medium truncate">{app.profiles?.username || 'Candidat'}</CardTitle>
                        <CardDescription className="text-xs truncate">{timeAgo(app.created_at)}</CardDescription>
                    </div>
                </div>
            </CardHeader>

            {/* Explicit View Button Overlay */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    variant="secondary"
                    size="icon"
                    className="h-6 w-6 rounded-full shadow-sm"
                    onClick={(e) => {
                        e.stopPropagation() // Prevent Drag Listeners from firing if they were somehow attached
                        onClick()
                    }}
                    onPointerDown={(e) => e.stopPropagation()} // Stop dnd-kit from seeing this as a drag start
                >
                    <Eye className="h-3 w-3" />
                </Button>
            </div>

            {/* Make the whole card clickable for view if user holds still, but View button is safer */}
            <div
                className="absolute inset-0 z-0"
                onClick={onClick}
            />
        </Card>
    )
}

function ApplicationDetails({ app, open, onClose, schema = [], canDelete = false }: { app: any, open: boolean, onClose: () => void, schema: any[], canDelete?: boolean }) {
    if (!app) return null

    const getLabel = (id: string) => {
        if (!schema || schema.length === 0) return `Question`
        const field = schema.find(f => f.id === id)
        // Clean label if it has trailing ":"
        return field ? field.label.replace(/:$/, '') : `Question interne`
    }

    const { status } = app

    const handleDelete = async () => {
        if (!confirm("Voulez-vous vraiment supprimer cette candidature ?")) return
        try {
            await deleteApplication(app.id)
            onClose()
            window.location.reload()
        } catch (e) {
            alert("Erreur lors de la suppression")
        }
    }

    const handleStatusChange = async (newStatus: Status) => {
        try {
            await updateApplicationStatus(app.id, newStatus)
            onClose() // Close after action for MVP simplicity, or we could update local state
            // Ideally we should update the parent state, but for now a refresh/close is okay or let the optimistic UI in parent handle it if we passed a callback.
            // Since we don't have a callback here, we'll just close it.
            window.location.reload() // Force reload to see changes for now as state is in parent
        } catch (e) {
            alert("Erreur")
        }
    }

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-2xl bg-white p-0 overflow-hidden flex flex-col gap-0 border-l shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b bg-gray-50/50 flex items-start gap-4">
                    <Avatar className="h-16 w-16 border-4 border-white shadow-sm">
                        <AvatarImage src={app.profiles?.avatar_url} />
                        <AvatarFallback className="text-xl bg-gray-900 text-white">
                            {(app.profiles?.username?.[0] || 'U').toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                            <SheetTitle className="text-2xl font-bold text-gray-900">
                                {app.profiles?.username}
                            </SheetTitle>
                            <div className="flex items-center gap-2">
                                <Badge variant={
                                    status === 'accepted' ? 'default' :
                                        status === 'rejected' ? 'destructive' :
                                            status === 'interview' ? 'secondary' : 'outline'
                                } className="uppercase tracking-wider text-[10px] py-1 px-2">
                                    {COLUMNS.find(c => c.id === status)?.label}
                                </Badge>
                                {canDelete && (
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600" onClick={handleDelete}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                        <SheetDescription className="text-base">
                            Candidature déposée le {new Date(app.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </SheetDescription>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto w-full">
                    <div className="p-6 space-y-8 pb-20">
                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-6 flex items-center gap-2">
                                <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                                Réponses au formulaire
                            </h3>

                            {schema && schema.length > 0 ? (
                                <div className="space-y-8">
                                    {schema.map((field) => {
                                        const value = app.answers?.[field.id]
                                        // Skip if no answer and not required? No, show everything so they see what was skipped.

                                        return (
                                            <div key={field.id} className="group">
                                                <h4 className="font-medium text-base text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                                    {field.label}
                                                </h4>
                                                <div className="bg-gray-50 px-5 py-4 rounded-xl text-gray-700 leading-relaxed border border-gray-100 group-hover:border-blue-100 transition-colors shadow-sm">
                                                    {typeof value === 'boolean' ?
                                                        (value ? '✅ Oui' : '❌ Non') :
                                                        (value ? (
                                                            <p className="whitespace-pre-wrap break-words">{String(value)}</p>
                                                        ) : <span className="text-gray-400 italic">Non répondu</span>)
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })}
                                    {/* Handle answers that might not be in schema anymore (optional, maybe skip for now to keep it clean) */}
                                </div>
                            ) : (
                                // Fallback if schema is missing but answers exist (legacy support)
                                app.answers && Object.keys(app.answers).length > 0 ? (
                                    <div className="space-y-8">
                                        {Object.entries(app.answers).map(([key, value]: [string, any]) => (
                                            <div key={key} className="group">
                                                <h4 className="font-medium text-base text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                                    {getLabel(key)}
                                                </h4>
                                                <div className="bg-gray-50 px-5 py-4 rounded-xl text-gray-700 leading-relaxed border border-gray-100 group-hover:border-blue-100 transition-colors shadow-sm">
                                                    {typeof value === 'boolean' ?
                                                        (value ? '✅ Oui' : '❌ Non') :
                                                        (value ? (
                                                            <p className="whitespace-pre-wrap break-words">{String(value)}</p>
                                                        ) : <span className="text-gray-400 italic">Non répondu</span>)
                                                    }
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <p className="text-gray-500 font-medium">Aucune réponse fournie</p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}


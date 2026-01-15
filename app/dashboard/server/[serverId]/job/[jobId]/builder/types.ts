
export type FieldType = 'text' | 'textarea' | 'number' | 'select' | 'checkbox'

export type FormField = {
    id: string
    type: FieldType
    label: string
    required: boolean
    placeholder?: string
    options?: string[] // For select
}

export const FIELD_TYPES: { type: FieldType; label: string; icon: string }[] = [
    { type: 'text', label: 'Texte Court', icon: 'Type' },
    { type: 'textarea', label: 'Texte Long', icon: 'AlignLeft' },
    { type: 'number', label: 'Nombre', icon: 'Hash' },
    { type: 'select', label: 'Sélection', icon: 'List' },
    { type: 'checkbox', label: 'Case à cocher', icon: 'CheckSquare' },
]

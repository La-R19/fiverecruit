
"use client"

import { Server } from "lucide-react"
import { useState } from "react"

export function ServerCardImage({ src, alt }: { src?: string, alt: string }) {
    const [error, setError] = useState(false)

    if (!src || error) {
        return (
            <div className="h-full w-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
                <Server className="h-10 w-10 text-indigo-300/50" />
            </div>
        )
    }

    return (
        <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            onError={() => setError(true)}
        />
    )
}

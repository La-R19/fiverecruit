
"use client"

import { Server } from "lucide-react"
import { useState, useMemo } from "react"

export function ServerCardImage({ src, alt }: { src?: string, alt: string }) {
    // If src is clearly empty/null, consider it an error immediately
    const [error, setError] = useState(!src || src === "")

    // Reset error state if src prop changes to a valid value
    useMemo(() => {
        if (src && src.length > 5) setError(false)
    }, [src])

    const gradient = useMemo(() => {
        const hash = alt.split("").reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0)
        const hue1 = Math.abs(hash % 360)
        const hue2 = (hue1 + 40) % 360
        return `linear-gradient(135deg, hsl(${hue1}, 70%, 50%), hsl(${hue2}, 90%, 60%))`
    }, [alt])

    if (!src || error) {
        return (
            <div
                className="h-full w-full flex items-center justify-center relative overflow-hidden"
                style={{ background: gradient }}
            >
                {/* Decorative overlay */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />

                {/* Icon */}
                <div className="relative z-10 bg-white/20 p-4 rounded-full backdrop-blur-md shadow-inner border border-white/30">
                    <Server className="h-8 w-8 text-white drop-shadow-md" />
                </div>
            </div>
        )
    }

    return (
        <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setError(true)}
        />
    )
}

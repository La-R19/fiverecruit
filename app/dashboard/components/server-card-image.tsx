
"use client"

import { Server } from "lucide-react"
import { useState, useMemo } from "react"

export function ServerCardImage({ src, alt }: { src?: string, alt: string }) {
    const [error, setError] = useState(false)

    // Generate a consistent gradient based on the server name
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
                <div className="relative z-10 bg-white/20 p-3 rounded-full backdrop-blur-md shadow-inner border border-white/30">
                    <img
                        src="/logo.png"
                        alt="Logo"
                        className="h-10 w-10 object-contain drop-shadow-md opacity-90"
                    />
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

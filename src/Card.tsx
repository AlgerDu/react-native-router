import type { CSSProperties } from "react"

export interface CardProps {
    backgroundColor?: CSSProperties['backgroundColor']
}

export function Card({ backgroundColor }: CardProps) {
    return <div style={{ borderRadius: 8, backgroundColor: backgroundColor ?? 'green', width: 50, height: 50 }}>

    </div>
}
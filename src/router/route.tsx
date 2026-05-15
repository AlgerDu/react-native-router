import { type ReactNode } from 'react'

export type RouteChildrenLoader = () => RouteObject[]

export type Navigate = (to: string) => void

export interface RouteObject {
    path: string
    element: ReactNode
    children?: RouteObject[]
    childrenLoader?: RouteChildrenLoader
    indexChild?: string
}

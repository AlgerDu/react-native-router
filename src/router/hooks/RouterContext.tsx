import { createContext } from 'react'
import type { Navigate } from '../route'

export interface RouterContextValue {
    navigate: Navigate
    pushState: (path: string, searchs?: URLSearchParams) => void
}

export const RouterContext = createContext<RouterContextValue>({
    navigate: function (): void {
        throw new Error('Function not implemented.')
    },
    pushState: function (): void {
        throw new Error('Function not implemented.')
    },
})

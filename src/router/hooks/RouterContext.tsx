import { createContext } from 'react'
import { Navigate } from '../route'

export interface RouterContextValue {
    navigate: Navigate
    pushState: (path: string, searchs?: URLSearchParams) => void
}

export const RouterContext = createContext<RouterContextValue>({
    navigate: function (to: string): void {
        throw new Error('Function not implemented.')
    },
    pushState: function (path: string, searchs?: URLSearchParams): void {
        throw new Error('Function not implemented.')
    },
})

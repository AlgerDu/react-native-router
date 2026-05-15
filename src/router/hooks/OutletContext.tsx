import { createContext } from 'react'
import type { Navigate, RouteObject } from '../route'
import type { Params } from '../utils/path'
import type { SetSearchParams } from '../utils/search'

export interface OutletContextValue {
    pathname: string
    toMatchPaths: string[]
    params: Params
    searchParams: URLSearchParams
    route: RouteObject

    navigate: Navigate
    setSearchParams: SetSearchParams
}

export const OutletContext = createContext<OutletContextValue>({
    pathname: '',
    toMatchPaths: [],
    params: {},
    searchParams: new URLSearchParams(),
    route: {
        path: '',
        element: undefined,
    },
    navigate: function (): void {
        throw new Error('Function not implemented.')
    },
    setSearchParams: function (): void {
        throw new Error('Function not implemented.')
    },
})

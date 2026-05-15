import { createContext, SetStateAction } from 'react'
import { Navigate, RouteObject } from '../route'
import { Params } from '../utils/path'
import { SetSearchParams } from '../utils/search'

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
    navigate: function (to: string): void {
        throw new Error('Function not implemented.')
    },
    setSearchParams: function (value: SetStateAction<URLSearchParams>): void {
        throw new Error('Function not implemented.')
    },
})

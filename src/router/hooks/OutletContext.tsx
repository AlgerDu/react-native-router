import { createContext } from 'react'
import type { RouteObject } from '../route'
import type { Params } from '../utils/path'

/**
 * outlet 上下文
 */
export interface OutletContextValue {
    /** 路径 */
    pathname: string

    /** 待匹配的子路径 */
    toMatchPaths: string[]

    /** 包含的路由参数 */
    params: Params

    /** 匹配的路由配置 */
    route: RouteObject

    /** 包含的 search 参数 */
    searchParams: URLSearchParams
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
})

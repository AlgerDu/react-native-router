import { type ReactNode } from 'react'

export type RouteChildrenLoader = () => RouteObject[]

export type Navigate = (to: string) => void

/**
 * 路由配置
 */
export interface RouteObject {
    /** 匹配路径 */
    path: string

    /** 路由对应的组件 */
    element: ReactNode

    /** 子路由 */
    children?: RouteObject[]

    /** 子路由加载器（目前无效） */
    childrenLoader?: RouteChildrenLoader

    /** 默认的子路由 */
    indexChild?: string
}

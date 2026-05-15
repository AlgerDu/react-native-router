import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { OutletContext, type OutletContextValue } from '../hooks/OutletContext'
import { RouterContext, type RouterContextValue } from '../hooks/RouterContext'
import { type RouteObject } from '../route'
import { type SetSearchParams } from '../utils/search'
import { Outlet } from './Outlet'

export interface BrowserRouterProps {
    /**
     * 路由配置
     */
    routes: RouteObject[]

    /**
     * 应用的根路径
     */
    basePath?: string
}

export function BrowserRouter({ routes, basePath }: BrowserRouterProps) {
    const id = useId()

    const currentPath = useRef('')
    const toNavigate = useRef(window.location.pathname)

    const [trigger, setTrigger] = useState('0')
    const [searchParams, setSearchParams] = useState<URLSearchParams>(
        new URLSearchParams(window.location.search),
    )

    const [rootOutlet, setRootOutlet] = useState<OutletContextValue>()

    const setNavigate = useCallback((to: string) => {
        toNavigate.current = to
        setTrigger(`${Math.random()}`)
    }, [])

    const handleNavigate = useCallback(
        (path: string) => {
            setNavigate(path)
            history.pushState({}, '', window.location.origin + path)
        },
        [setNavigate],
    )

    const handleSetSearchParmas = useCallback<SetSearchParams>((value) => {
        setSearchParams(value)
    }, [])

    const handlePushState = useCallback((path: string, searchParams?: URLSearchParams) => {
        if (searchParams && searchParams.size > 0) {
            path += `?${searchParams}`
        }

        const fullPath = window.location.origin + path
        currentPath.current = path

        history.pushState({}, '', fullPath)
    }, [])

    useEffect(() => {
        const handlePopstate = (e: PopStateEvent) => {
            setSearchParams(new URLSearchParams(window.location.search))
            setNavigate(window.location.pathname)

            e.preventDefault()
        }

        window.addEventListener('popstate', handlePopstate)
        return () => window.removeEventListener('popstate', handlePopstate)
    }, [setNavigate])

    useEffect(() => {
        if (!trigger || currentPath.current === toNavigate.current) {
            return
        }

        currentPath.current = toNavigate.current
        toNavigate.current = ''

        let path = currentPath.current
        if (basePath) {
            path = path.replace(basePath, '')
        }
        const paths = path.split('/')

        setRootOutlet({
            params: {},
            searchParams,
            route: {
                path: '/',
                element: undefined,
                children: routes,
            },
            toMatchPaths: paths.slice(1),
            pathname: '',
            navigate: handleNavigate,
            setSearchParams: handleSetSearchParmas,
        })
    }, [basePath, handleNavigate, handleSetSearchParmas, routes, searchParams, trigger])

    const routerContext = useMemo((): RouterContextValue => {
        return {
            navigate: handleNavigate,
            pushState: handlePushState,
        }
    }, [handleNavigate, handlePushState])

    console.log(`render BrowserRouter[${id}]`, rootOutlet)

    if (!rootOutlet) {
        return undefined
    }

    return (
        <RouterContext.Provider value={routerContext}>
            <OutletContext.Provider value={rootOutlet}>
                <Outlet />
            </OutletContext.Provider>
        </RouterContext.Provider>
    )
}

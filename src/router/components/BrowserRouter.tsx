import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { NavigateContext, type NavigateContextValue } from '../hooks/NavigateContext'
import { OutletContext, type OutletContextValue } from '../hooks/OutletContext'
import { RouterContext, type RouterContextValue } from '../hooks/RouterContext'
import { type Navigate, type RouteObject } from '../route'
import { type SetSearchParams } from '../utils/search'
import { Outlet } from './Outlet'

export interface BrowserRouterProps {
    /**
     * 路由配置
     */
    router: RouteObject

    /**
     * 应用的根路径
     */
    basePath?: string
}

const location = window.location

/**
 * 处理和浏览器的交互
 */
export function BrowserRouter({ router, basePath }: BrowserRouterProps) {
    const id = useId()

    const pathRef = useRef(location.pathname)
    const searchRef = useRef(`${new URLSearchParams(location.search).sort()}`)

    const buildRoot = useCallback(
        (path: string, search: string): OutletContextValue => {
            if (basePath) {
                path = path.replace(basePath, '')
            }
            const paths = path.split('/')
            return {
                params: {},
                searchParams: new URLSearchParams(search),
                route: {
                    path: '',
                    element: undefined,
                    children: [router],
                },
                toMatchPaths: paths.slice(1),
                pathname: '',
            }
        },
        [basePath, router],
    )
    const [root, setRoot] = useState(() => {
        const sp = new URLSearchParams(location.search)
        sp.sort()
        return buildRoot(location.pathname, `${sp}`)
    })

    const pushState = useCallback((path: string, search?: URLSearchParams | string) => {
        if (search) {
            if (typeof search !== 'string') {
                search.sort()
                search = `${search}`
            }
        } else {
            search = ''
        }

        let full = window.location.origin + path
        if (search) {
            full = full + '?' + search
        }

        pathRef.current = path
        searchRef.current = search

        history.pushState({}, '', full)
    }, [])

    const navigate = useCallback<Navigate>(
        (to: string) => {
            const [path, originalSearch] = to.split('?')

            let search = ''
            if (originalSearch) {
                search = `${new URLSearchParams(originalSearch).sort()}`
            }

            if (path === pathRef.current && search === searchRef.current) {
                return
            }

            pushState(to, search)
            setRoot(buildRoot(path, search))
        },
        [buildRoot, pushState],
    )

    const setSearch = useCallback<SetSearchParams>(
        (value) => {
            if (typeof value === 'function') {
                value = value(new URLSearchParams(searchRef.current))
            }

            const search = `${value.sort()}`
            if (search === searchRef.current) {
                return
            }

            pushState(pathRef.current, search)
            setRoot(buildRoot(pathRef.current, search))
        },
        [buildRoot, pushState],
    )

    useEffect(() => {
        const handlePopstate = (e: PopStateEvent) => {
            navigate(location.pathname + '?' + location.pathname)
            e.preventDefault()
        }

        window.addEventListener('popstate', handlePopstate)
        return () => window.removeEventListener('popstate', handlePopstate)
    }, [navigate])

    const routerValue = useMemo((): RouterContextValue => {
        return {
            navigate: navigate,
            pushState: pushState,
        }
    }, [navigate, pushState])

    const navigateValue = useMemo((): NavigateContextValue => {
        return {
            navigate,
            setSearchParams: setSearch,
        }
    }, [navigate, setSearch])

    console.log(`render BrowserRouter[${id}]`, root)

    if (!root) {
        return undefined
    }

    return (
        <RouterContext.Provider value={routerValue}>
            <OutletContext.Provider value={root}>
                <NavigateContext.Provider value={navigateValue}>
                    <Outlet />
                </NavigateContext.Provider>
            </OutletContext.Provider>
        </RouterContext.Provider>
    )
}

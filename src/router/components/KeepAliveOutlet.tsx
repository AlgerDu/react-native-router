import { useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react'
import { OutletContext, type OutletContextValue } from '../hooks/OutletContext'
import { RouterContext, type RouterContextValue } from '../hooks/RouterContext'
import { type RouteObject } from '../route'
import { matchChild, type Params } from '../utils/path'

export interface KeepAliveOutletProps {
    onChange?: (params: Params, child?: RouteObject) => void
    max?: number
}

export function KeepAliveOutlet({ onChange, max = 8 }: KeepAliveOutletProps) {
    const id = useId()
    const { pushState, navigate: rootNavigate } = useContext(RouterContext)

    const { route, toMatchPaths, params, searchParams, pathname } = useContext(OutletContext)

    const refLastpath = useRef(new Map<string, string>())
    const refQueue = useRef<string[]>([])
    const refItems = useRef(new Map<string, OutletContextValue>())

    const [items, setItems] = useState<OutletContextValue[]>([])
    const [currPath, setCurrPath] = useState<string>()

    const handleChildPushState = useCallback(
        (path: string, searchParams?: URLSearchParams) => {
            for (const key of refItems.current.keys()) {
                if (path.startsWith(key)) {
                    let lastPath = path.slice(key.length)
                    if (searchParams && searchParams.size > 0) {
                        lastPath = lastPath + `?${searchParams}`
                    }

                    refLastpath.current.set(key, lastPath)
                    setCurrPath(key)
                    break
                }
            }

            pushState(path, searchParams)
        },
        [pushState],
    )

    const handleNavigate = useCallback((key: string, to: string) => {
        const item = refItems.current.get(key)
        if (item) {
            refItems.current.set(key, {
                ...item,
                toMatchPaths: to.split('/'),
                searchParams: new URLSearchParams(),
            })

            setCurrPath(item.pathname)
            setItems(Array.from(refItems.current.values()))
        }
    }, [])

    const handleSetSearchParmas = useCallback(
        (key: string, value: React.SetStateAction<URLSearchParams>) => {
            const item = refItems.current.get(key)
            if (item) {
                if (typeof value === 'function') {
                    value = value(item.searchParams)
                }

                refItems.current.set(key, {
                    ...item,
                    searchParams: new URLSearchParams(value),
                })

                setCurrPath(item.pathname)
                setItems(Array.from(refItems.current.values()))
            }
        },
        [],
    )

    const tryToCacheContext = useCallback(
        (context?: OutletContextValue) => {
            if (onChange) {
                onChange(context?.params ?? {}, context?.route)
            }

            if (!context) {
                setCurrPath(undefined)
                return
            }

            const key = context.pathname
            const item = refItems.current.get(key)

            if (!item) {
                if (refQueue.current.length >= max) {
                    const first = refQueue.current.shift()
                    if (first) {
                        refItems.current.delete(first)
                    }
                }

                refQueue.current.push(key)
                refItems.current.set(key, context)

                if (context.toMatchPaths.length > 0) {
                    let lastpath = context.toMatchPaths.join('/')
                    lastpath = '/' + lastpath
                    if (context.searchParams.size > 0) {
                        lastpath = `?${context.searchParams}`
                    }
                    refLastpath.current.set(key, lastpath)
                }

                setCurrPath(context.pathname)
                setItems(Array.from(refItems.current.values()))
                return
            }

            if (context.toMatchPaths.length === 0) {
                const lastPath = refLastpath.current.get(key)
                if (lastPath && lastPath.length > 0) {
                    pushState(context.pathname + lastPath)
                }

                setCurrPath(context.pathname)
                setItems(Array.from(refItems.current.values()))
                return
            }

            refItems.current.set(key, context)
            setCurrPath(context.pathname)
            setItems(Array.from(refItems.current.values()))
            return
        },
        [max, onChange, pushState],
    )

    useEffect(() => {
        if (!route.children || toMatchPaths.length === 0) {
            tryToCacheContext(undefined)
            return
        }

        const routeContext: OutletContextValue = {
            pathname: '',
            toMatchPaths: [],
            params: { ...params },
            searchParams: searchParams,
            route: {
                path: '',
                element: undefined,
            },
            navigate: (to) => handleNavigate(routeContext.pathname, to),
            setSearchParams: (value) => handleSetSearchParmas(routeContext.pathname, value),
        }

        let childRoute = route.children.find((i) => {
            const rst = matchChild(toMatchPaths, -1, i)
            if (rst) {
                routeContext.params = { ...routeContext.params, ...rst.params }
                routeContext.route = i
                if (i.path === '/') {
                    throw Error('in keep alive, child cant be /')
                } else {
                    routeContext.pathname = `${pathname}/${toMatchPaths.slice(0, rst.level + 1)}`
                    routeContext.toMatchPaths = toMatchPaths.slice(rst.level + 1)
                }
                return i
            }
        })

        if ((toMatchPaths.length === 1 && toMatchPaths[0] === '') || toMatchPaths.length === 0) {
            childRoute = route.children.find((i) => i.path === route.indexChild)
            if (childRoute) {
                routeContext.pathname = `${pathname}/${childRoute.path}`
                routeContext.toMatchPaths = []
                routeContext.params = { ...params }
                routeContext.route = childRoute
            }
        }

        if (childRoute) {
            tryToCacheContext(routeContext)
            return
        }

        tryToCacheContext(undefined)
    }, [
        handleNavigate,
        handleSetSearchParmas,
        params,
        pathname,
        route.children,
        searchParams,
        toMatchPaths,
        tryToCacheContext,
        route,
    ])

    const routerContext = useMemo((): RouterContextValue => {
        return {
            navigate: rootNavigate,
            pushState: handleChildPushState,
        }
    }, [handleChildPushState, rootNavigate])

    console.log(`render outlet[${id} | ${currPath}]`)

    return (
        <RouterContext.Provider value={routerContext}>
            <div
                style={{
                    display: 'inline-block',
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                }}
            >
                {items.map((i) => {
                    return (
                        <div
                            key={i.pathname}
                            style={{
                                position: 'absolute',
                                display: 'block',
                                width: '100%',
                                height: '100%',
                                right: i.pathname === currPath ? undefined : -9999999,
                            }}
                        >
                            <OutletContext.Provider value={i}>
                                {i.route.element}
                            </OutletContext.Provider>
                        </div>
                    )
                })}
            </div>
        </RouterContext.Provider>
    )
}

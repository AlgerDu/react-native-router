import { useCallback, useContext, useEffect, useId, useState } from 'react'
import { OutletContext, type OutletContextValue } from '../hooks/OutletContext'
import type { Navigate, RouteObject } from '../route'
import { matchChild, type Params } from '../utils/path'
import type { SetSearchParams } from '../utils/search'

export interface OutletProps {
    onChange?: (params: Params, child?: RouteObject) => void
}

export function Outlet({ onChange }: OutletProps) {
    const { route, toMatchPaths, params, searchParams, pathname } = useContext(OutletContext)
    const id = useId()

    const [childContext, setChildContext] = useState<OutletContextValue>()

    const handleNavigate = useCallback<Navigate>((to) => {
        setChildContext((value) => {
            if (!value) {
                return value
            }

            return {
                ...value,
                toMatchPaths: to.split('/'),
                searchParams: new URLSearchParams(),
            }
        })
    }, [])

    const handleSetSearchParmas = useCallback<SetSearchParams>((value) => {
        setChildContext((context) => {
            if (!context) {
                return context
            }

            if (typeof value === 'function') {
                value = value(context.searchParams)
            }

            return {
                ...context,
                searchParams: new URLSearchParams(value),
            }
        })
    }, [])

    useEffect(() => {
        if (!route.children) {
            setChildContext(undefined)
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
            navigate: handleNavigate,
            setSearchParams: handleSetSearchParmas,
        }

        const childRoute = route.children.find((i) => {
            const rst = matchChild(toMatchPaths, -1, i)
            if (rst) {
                routeContext.params = { ...routeContext.params, ...rst.params }
                routeContext.route = i
                if (i.path === '/') {
                    routeContext.pathname = pathname
                    routeContext.toMatchPaths = toMatchPaths
                } else {
                    routeContext.pathname = `${pathname}/${toMatchPaths
                        .slice(0, rst.level + 1)
                        .join('/')}`
                    routeContext.toMatchPaths = toMatchPaths.slice(rst.level + 1)
                }
                return i
            }
        })

        if (childRoute) {
            setChildContext(routeContext)
            return
        }

        if ((toMatchPaths.length === 1 && toMatchPaths[0] === '') || toMatchPaths.length === 0) {
            const child = route.children.find((i) => i.path === route.indexChild)
            if (child) {
                setChildContext({
                    pathname: `${pathname}/${child.path}`,
                    toMatchPaths: [],
                    params: { ...params },
                    searchParams,
                    route: child,
                    navigate: handleNavigate,
                    setSearchParams: handleSetSearchParmas,
                })
                return
            }
        }

        setChildContext(undefined)
    }, [handleNavigate, handleSetSearchParmas, params, pathname, route, searchParams, toMatchPaths])

    useEffect(() => {
        if (onChange) {
            onChange(childContext?.params ?? {}, childContext?.route)
        }
    }, [childContext, onChange])

    console.log(`render outlet[${id} | ${childContext?.pathname}]`, childContext)

    if (!childContext) {
        return undefined
    }

    return (
        <OutletContext.Provider value={childContext}>
            {childContext.route.element}
        </OutletContext.Provider>
    )
}

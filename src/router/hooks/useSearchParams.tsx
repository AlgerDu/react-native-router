import { useCallback, useContext, useMemo } from 'react'
import { SearchParamsInit, SetSearchParams } from '../utils/search'
import { OutletContext } from './OutletContext'
import { RouterContext } from './RouterContext'

export function useSearchParams(
    defaultInit?: SearchParamsInit,
): [URLSearchParams, SetSearchParams] {
    const { pushState } = useContext(RouterContext)
    const { searchParams, setSearchParams, pathname } = useContext(OutletContext)

    const handleSetSearchParmas = useCallback<SetSearchParams>(
        (value) => {
            if (typeof value === 'function') {
                value = value(searchParams)
            }

            pushState(pathname, value)
            setSearchParams(value)
        },
        [pathname, pushState, searchParams, setSearchParams],
    )

    const withDefault = useMemo(() => {
        if (defaultInit) {
            const defaultParams = new URLSearchParams(defaultInit)

            for (const [k, v] of defaultParams.entries()) {
                if (!searchParams.has(k)) {
                    searchParams.set(k, v)
                }
            }
        }

        return searchParams
    }, [defaultInit, searchParams])

    return [withDefault, handleSetSearchParmas]
}

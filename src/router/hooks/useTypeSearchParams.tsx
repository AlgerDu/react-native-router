import { useCallback, useContext, useMemo, type Dispatch, type SetStateAction } from 'react'
import { NavigateContext } from './NavigateContext'
import { OutletContext } from './OutletContext'
import { RouterContext } from './RouterContext'

/**
 * 强类型的 search params
 * @param defaultValue 默认值
 */
export function useTypeSearchParams<T = any>(
    defaultValue?: Partial<T>,
): [T, Dispatch<SetStateAction<T>>] {
    const { pushState } = useContext(RouterContext)
    const { searchParams, pathname } = useContext(OutletContext)
    const { setSearchParams } = useContext(NavigateContext)

    const value = useMemo(() => {
        const value: any = { ...defaultValue }

        for (const [k, v] of searchParams.entries()) {
            value[k] = v
        }

        return value as T
    }, [defaultValue, searchParams])

    const setValue = useCallback<Dispatch<SetStateAction<T>>>(
        (nValue) => {
            if (typeof nValue === 'function') {
                nValue = (nValue as (v: T) => T)(value)
            }

            const params = new URLSearchParams(nValue as Record<string, string>)

            pushState(pathname, params)
            setSearchParams(params)
        },
        [pathname, pushState, setSearchParams, value],
    )

    return [value, setValue]
}

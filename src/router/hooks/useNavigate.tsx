import { useCallback, useContext } from 'react'
import { OutletContext } from './OutletContext'
import { RouterContext } from './RouterContext'

export function useNavigate() {
    const { navigate: rootNavigate, pushState } = useContext(RouterContext)
    const { navigate, pathname } = useContext(OutletContext)

    return useCallback(
        (to: string) => {
            if (to.startsWith('/')) {
                rootNavigate(to)
                return
            }

            const path = `${pathname}/${to}`
            pushState(path)
            navigate(to)
        },
        [navigate, pathname, pushState, rootNavigate],
    )
}

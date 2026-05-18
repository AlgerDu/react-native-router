import { useCallback, useContext } from 'react'
import { NavigateContext } from './NavigateContext'
import { OutletContext } from './OutletContext'
import { RouterContext } from './RouterContext'

export function useNavigate() {
    const { navigate: rootNavigate, pushState } = useContext(RouterContext)
    const { pathname } = useContext(OutletContext)
    const { navigate } = useContext(NavigateContext)

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

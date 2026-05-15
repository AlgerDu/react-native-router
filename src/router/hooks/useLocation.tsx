import { useContext } from 'react'
import { OutletContext } from './OutletContext'

export function useLocation() {
    const { pathname } = useContext(OutletContext)
    return { pathname }
}

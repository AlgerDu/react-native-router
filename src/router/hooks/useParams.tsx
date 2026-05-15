import { useContext } from 'react'
import { OutletContext } from './OutletContext'

export function useParams() {
    const { params } = useContext(OutletContext)

    return params
}

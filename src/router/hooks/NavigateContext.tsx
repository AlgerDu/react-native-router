import { createContext } from 'react'
import type { Navigate } from '../route'
import type { SetSearchParams } from '../utils/search'

export interface NavigateContextValue {
    /** 导航 */
    navigate: Navigate

    /** 设置 search 参数 */
    setSearchParams: SetSearchParams
}

export const NavigateContext = createContext<NavigateContextValue>({
    navigate: function (): void {
        throw new Error('Function not implemented.')
    },
    setSearchParams: function (): void {
        throw new Error('Function not implemented.')
    },
})

import { PropsWithChildren, useCallback } from 'react'
import { useNavigate } from '../hooks/useNavigate'

export interface LinkProps {
    to: string
    onClick?: () => void
}

export function Link({ to, children, onClick }: PropsWithChildren<LinkProps>) {
    const navigate = useNavigate()

    const handleClick = useCallback(
        (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault()
            if (onClick) {
                onClick()
                return
            }

            navigate(to)
        },
        [navigate, onClick, to],
    )

    return (
        <a href={to} onClick={handleClick}>
            {children}
        </a>
    )
}

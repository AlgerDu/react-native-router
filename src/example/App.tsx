import { Link, Outlet } from '../router'

export function App() {
    return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
            <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
                {tabs.map((i) => {
                    return (
                        <Link key={i.name} to={i.path}>
                            {i.name}
                        </Link>
                    )
                })}
            </div>
            <Outlet />
        </div>
    )
}

const tabs: { path: string; name: string }[] = [
    {
        name: 'home',
        path: 'home',
    },
    {
        name: 'about',
        path: 'about',
    },
]

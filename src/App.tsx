import './App.css'
import { App as Exapmpe } from './example/App'
import { About } from './example/pages/About'
import { Home } from './example/pages/Home'
import { BrowserRouter, type RouteObject } from './router'

function App() {
    return <BrowserRouter routes={routs} />
}

export default App

const routs: RouteObject[] = [
    {
        path: '/',
        element: <Exapmpe />,
        indexChild: 'home',
        children: [
            {
                path: 'home',
                element: <Home />,
            },
            {
                path: 'about',
                element: <About />,
            },
        ],
    },
]

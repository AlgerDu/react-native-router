import { BrowserRouter } from './components/BrowserRouter'
import { KeepAliveOutlet } from './components/KeepAliveOutlet'
import { Link } from './components/Link'
import { Outlet } from './components/Outlet'
import { OutletContext } from './hooks/OutletContext'
import { useLocation } from './hooks/useLocation'
import { useNavigate } from './hooks/useNavigate'
import { useParams } from './hooks/useParams'
import { useSearchParams } from './hooks/useSearchParams'
import { RouteObject } from './route'
import { Params } from './utils/path'

// 自定义的组件及 hock 等

export type { Params, RouteObject }

export { OutletContext, useLocation, useNavigate, useParams, useSearchParams }

export { BrowserRouter, KeepAliveOutlet, Link, Outlet }

# React Native Router

## 为什么

1. 实现 `keep alive` 功能，提升单体应用中核心模块切换的速度和体验；
2. 实现一个适合单体应用的精简 `router` 组件；

### keep alive

单体应用

## 安装

```
npm i @algerdu/react-native-router
```

## 基础配置及使用

### 定义路由

```
const route: RouteObject = {
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
}
```

### 使用 `BrowserRouter`

在顶层组件中使用定义好的路由。

```
import { BrowserRouter, type RouteObject } from './router'

function App() {
    return <BrowserRouter router={route} />
}
```

### 在子组件中使用 `Outlet` 承载子路由

```
import { Outlet } from '../router'

function Exapmpe() {
    return <Outlet />
}
```

## 功能

### 路由参数

1. 路由定义时设置参数名：

```
const route: RouteObject = {
    path: '{bookID}',
    element: <Book />,
}
```

2. 在组件中通过 `useParams` 获取对应的值

```
const { bookID } = useParams()
```

## 组件与 hooks

### `BrowserRouter`

`BrowserRouter` 负责与浏览器交互。处理浏览器事件：

- 路由变化
- 后退

将导航之后的路由写入浏览器历史。

支持的参数：

| 字段       | 必填 | 默认值 | 说明               |
| :--------- | :--: | :----: | :----------------- |
| `router`   |  是  |        | 定义的路由         |
| `basePath` |      |        | 路由的 `base` 路径 |

### `Outlet`

`Outlet` 用于 `render` 当前路由配置的子路由，只能有一个。

支持的参数：

| 字段       | 必填 | 默认值 | 说明                     |
| :--------- | :--: | :----: | :----------------------- |
| `onChange` |      |        | 用于响应子路由发生的变化 |

### `KeepAliveOutlet`

`KeepAliveOutlet` 的基础功能与 `Outlet` 相同,同时提供一些附近功能：

- 缓存展示过的子路由，重新切换回时，不需要重新 render；（其内部业务逻辑也不会执行，比如重新获取数据等）
- 切换回展示过的路由时能够定位到上次打开过的子路由

支持的参数：

| 字段       | 必填 | 默认值 | 说明                     |
| :--------- | :--: | :----: | :----------------------- |
| `onChange` |      |        | 用于响应子路由发生的变化 |
| `max`      |      |   8    | 最大的缓存数量           |

### `Link`

`Link` 是简易的导航组件。

支持的参数：

| 字段 | 必填 | 默认值 | 说明                                          |
| :--- | :--: | :----: | :-------------------------------------------- |
| `to` |  是  |        | 点击时导航到的路由。使用 `/` 开头代表绝对路径 |

### `OutletContext`

`OutletContext` 上下文可以在 `Outlet` 和 `KeepAliveOutlet` 展示的组件中使用，用于获取当前 `route` 的一些信息。

可以获取的信息：

| 字段           | 类型              | 说明                                            |
| :------------- | :---------------- | :---------------------------------------------- |
| `pathname`     | `string`          | 当前路由的 `path`。可能是 `book` 或者 `book/id` |
| `toMatchPaths` | `string[]`        | 待匹配的子路由                                  |
| `params`       | `Params`          | 包含的路由参数                                  |
| `route`        | `RouteObject`     | 匹配到的路由设置 object                         |
| `searchParams` | `URLSearchParams` | 包含的 `search` 参数                            |

### `useLocation`

通过 `useLocation` 获取当前组件所在的路由 path 。

> 不是浏览器的 url ，因为在 `keepalive` 的功能下，同时生效的路由会有多个，同时展示的路由才只有一个。

可以获取的信息：

| 字段       | 类型     | 说明                                            |
| :--------- | :------- | :---------------------------------------------- |
| `pathname` | `string` | 当前路由的 `path`。可能是 `book` 或者 `book/id` |

示例：

```
const { pathname } = useLocation()
```

### `useNavigate`

通过 `useNavigate` 获取的 function 跳转路由。

```
const { navigate } = useNavigate()

return <Button onClick={ ()=> navigate('/home') }> home </Buttion>
```

### `useParams`

通过 `useParams` 获取的当前节点的路由参数。

```
const { bookID } = useParams()
```

### `useParams`

通过 `useParams` 获取的当前节点的路由参数。

```
const { bookID } = useParams()
```

### `useTypeSearchParams`

通过 `useTypeSearchParams` 获取的当前的 `search` 参数。

```
const [ {tab}, setSearch ] = useTypeSearchParams<{ tab:string }>()

setSearch({tab:'second'})
```

### `RouteObject` 字段

| 字段         | 必填 | 默认值 | 说明               |
| :----------- | :--: | :----: | :----------------- |
| `path`       |  是  |        | 匹配的路径         |
| `element`    |  是  |        | 路由对应的 UI 组件 |
| `children`   |      |        | 子路由数组         |
| `indexChild` |      |        | 默认的子路由       |

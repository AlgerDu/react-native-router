import { type RouteObject } from '../route'

export type Params = { [key: string]: string | undefined }

export interface MatchRst {
    level: number
    params: Params
}

export function matchChild(
    paths: string[],
    currLevel: number,
    child: RouteObject,
): MatchRst | undefined {
    if (!child.path) {
        return undefined
    }

    if (child.path === '/') {
        return { level: currLevel, params: {} }
    }

    if (currLevel + 1 >= paths.length) {
        return undefined
    }

    let path = child.path
    if (path[0] === '/') {
        path = path.slice(1)
    }
    if (path[path.length - 1] === '/') {
        path = path.slice(0, path.length - 2)
    }

    const words = path.split('/')
    if (words.length + currLevel + 1 > paths.length) {
        return undefined
    }

    let childLevel = currLevel + 1
    const params: Params = {}

    for (const w of words) {
        if (w.startsWith(':')) {
            params[w.slice(1)] = paths[childLevel]
            childLevel++
            continue
        }

        if (w !== paths[childLevel]) {
            return undefined
        }

        childLevel++
    }

    return { level: childLevel - 1, params }
}

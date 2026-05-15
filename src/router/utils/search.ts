import { type Dispatch } from 'react'

export type SearchParamsInit = string[][] | URLSearchParams | string

export type SetSearchParams = Dispatch<React.SetStateAction<URLSearchParams>>

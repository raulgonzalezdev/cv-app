import { useRouter } from 'next/router'
import useSWR from 'swr'

import { REVEAL_USERS_ID, REVEAL_USERS_PROPS } from '../constants/api-urls'
import { useApi } from './useApi'

export const useUser = (
  props?: { key: string; value: string }[],
  role?: string
) => {
  const { api } = useApi()
  const { isReady, query } = useRouter()
  const page = Number(query.pageNumber) || 1

  let pages = !isNaN(page) && page > 1 ? `?page=${page}` : `?page=${1}`

  // add role filter
  if (role) {
    pages = pages + `&role=${role}`
  }

  const {
    data: response,
    error,
    mutate
  } = useSWR(isReady ? REVEAL_USERS_PROPS(props) + pages : null, api)

  const users = response?.data.results
  const meta = response?.data.meta || []

  return {
    users,
    meta,
    mutate,
    isLoading: !error && !response?.data,
    isError: !!error
  }
}

export const IDuseUsers = (id: string) => {
  const { api } = useApi()
  const { isReady } = useRouter()
  const {
    data: response,
    error,
    mutate
  } = useSWR(isReady && id ? REVEAL_USERS_ID(id) : null, api)

  const users = response?.data

  return {
    users,
    mutate,
    isLoading: !error && !response?.data,
    isError: !!error
  }
}

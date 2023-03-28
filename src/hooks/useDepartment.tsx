import { useRouter } from 'next/router'
import useSWR from 'swr'

import { REVEAL_DEPARTMENTS } from '../constants/api-urls'
import { useApi } from './useApi'

export const useDepartments = () => {
  const { api } = useApi()
  const { isReady } = useRouter()
  const {
    data: response,
    error,
    mutate
  } = useSWR(isReady ? REVEAL_DEPARTMENTS : null, api)

  const departments = response?.data

  return {
    departments,
    mutate,
    isLoading: !error && !response?.data,
    isError: !!error
  }
}

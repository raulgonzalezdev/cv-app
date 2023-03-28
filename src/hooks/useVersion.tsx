import { useRouter } from 'next/router'
import useSWR from 'swr'

import {
  REVEAL_LAST_VERSION_BY_APP,
  REVEAL_VERSION_BY_APP,
  REVEAL_VERSION_BY_ID
} from '../constants/api-urls'
import { useApi } from './useApi'

export const useVersionbyId = (id: string) => {
  const { api } = useApi()
  const { isReady } = useRouter()
  const {
    data: response,
    error,
    mutate
  } = useSWR(isReady && id ? REVEAL_VERSION_BY_ID(id) : null, api)

  const version = response?.data

  return {
    version,
    mutate,
    isLoading: !error && !response?.data,
    isError: !!error
  }
}

export const useVersionByApp = (
  instance_id: string,
  version_number?: string
) => {
  const { api } = useApi()
  const { isReady } = useRouter()
  const {
    data: response,
    error,
    mutate
  } = useSWR(
    isReady && instance_id && version_number
      ? REVEAL_VERSION_BY_APP(instance_id, version_number)
      : null,
    api
  )

  const app_version = response?.data

  return {
    app_version,
    mutate,
    isLoading: !error && !response?.data,
    isError: !!error
  }
}

export const useLastVersionByApp = (instance_id: string) => {
  const { api } = useApi()
  const { isReady } = useRouter()
  const {
    data: response,
    error,
    mutate
  } = useSWR(
    isReady && instance_id ? REVEAL_LAST_VERSION_BY_APP(instance_id) : null,
    api
  )

  const app_version = response?.data

  return {
    app_version,
    mutate,
    isLoading: !error && !response?.data,
    isError: !!error
  }
}

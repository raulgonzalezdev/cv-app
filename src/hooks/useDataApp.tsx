import { useRouter } from 'next/router'
import useSWR from 'swr'

import {
  REVEAL_APPS,
  REVEAL_APPS_PROPS,
  REVEAL_PUBLISHED_VERSIONS
} from '../constants/api-urls'
import { useApi } from './useApi'

export const useDataApps = (props?: { key: string; value: string }[]) => {
  let route
  if (props) {
    route = REVEAL_APPS_PROPS(props)
  } else {
    route = REVEAL_APPS
  }
  const { api } = useApi()
  const { isReady } = useRouter()
  const { data: response, error, mutate } = useSWR(isReady ? route : null, api)

  const apps = response?.data
  // console.log(apps)
  return {
    apps,
    mutate,
    isLoading: !error && !response?.data,
    isError: !!error
  }
}

export const usePublishedDataApp = () => {
  const { api } = useApi()
  const { isReady } = useRouter()
  const {
    data: response,
    error,
    mutate
  } = useSWR(isReady ? REVEAL_PUBLISHED_VERSIONS : null, api)

  const apps = response?.data.map(version => version.app_detail)

  return {
    apps,
    mutate,
    isLoading: !error && !response?.data,
    isError: !!error
  }
}

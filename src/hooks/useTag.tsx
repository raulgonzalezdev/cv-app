import { useRouter } from 'next/router'
import useSWR from 'swr'

import {
  REVEAL_TAGS,
  REVEAL_TAGS_BY_ID,
  REVEAL_TAGS_GET_APPS
} from '../constants/api-urls'
import { useApi } from './useApi'

export const useTags = () => {
  const { api } = useApi()
  const { isReady } = useRouter()
  const {
    data: response,
    error,
    mutate
  } = useSWR(isReady ? REVEAL_TAGS : null, api)

  const tags = response?.data

  return {
    tags,
    mutate,
    isLoading: !error && !response?.data,
    isError: !!error
  }
}

export const useTag = (id: string) => {
  const { api } = useApi()
  const { isReady } = useRouter()
  const {
    data: response,
    error,
    mutate
  } = useSWR(isReady && id ? REVEAL_TAGS_BY_ID(id) : null, api)

  const tag = response?.data

  return {
    tag,
    mutate,
    isLoading: !error && !response?.data,
    isError: !!error
  }
}

export const useAppsByTag = (tagId: string) => {
  const { api } = useApi()
  const { isReady } = useRouter()
  const {
    data: response,
    error,
    mutate
  } = useSWR(isReady && tagId ? REVEAL_TAGS_GET_APPS(tagId) : null, api)

  const apps = response?.data

  return {
    apps,
    mutate,
    isLoading: !error && !response?.data,
    isError: !!error
  }
}

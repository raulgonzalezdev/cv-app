import axios, { AxiosInstance } from 'axios'
import { parseCookies } from 'nookies'
import React, { createContext, useContext, useState } from 'react'

import DefaultProps from '../interfaces/default.props'
import { useAuth } from './useAuth'
import useToast from './useToast'

interface ApiContextData {
  loading: boolean
  api: AxiosInstance
}

const ApiContext = createContext<ApiContextData>({} as ApiContextData)

export const ApiProvider: React.FC<DefaultProps> = ({ children }) => {
  const { logout } = useAuth()
  const [loading, setLoading] = useState<boolean>(false)

  const toast = useToast()
  const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_BASE_URL })

  api.interceptors.request.use(
    request => {
      const { '@reavel.token': token } = parseCookies()

      if (request.headers && token) {
        request.headers.Authorization = `Bearer ${token}`
      }

      setLoading(true)
      return request
    },
    error => {
      setLoading(false)
      return Promise.reject(error)
    }
  )

  api.interceptors.response.use(
    response => {
      setLoading(false)

      if (response.data.msg) {
        toast({
          title: response.data.msg.title,
          status: response.data.msg.type
        })
      }

      return response
    },
    async function (error) {
      setLoading(false)

      if (error.response?.status === 401) {
        logout()

        toast({
          title: '',
          description: 'Seu acesso expirou, entre novamente!',
          status: 'warning'
        })
      } else if (error.response?.status === 404) {
        toast({
          title: '',
          description: 'Recurso não encontrado',
          status: 'error'
        })
      } else {
        if (error.response?.data?.msg) {
          toast({
            title: '',
            description: error.response.data.msg.title,
            status: error.response.data.msg.type
          })
        } else if (
          error.response?.data?.message &&
          typeof error.response.data.message === 'string'
        ) {
          toast({
            title: '',
            description: error.response.data.message,
            status: 'error'
          })
        } else if (
          error.response?.data?.message &&
          typeof error.response.data.message === 'object'
        ) {
          toast({
            title: '',
            description: 'Preencha os campos corretamente',
            status: 'error'
          })
        } else {
          toast({
            title: '',
            description: 'Erro interno, entre em contato com o suporte!',
            status: 'error'
          })
        }

        return Promise.reject(error.response?.data)
      }
    }
  )

  return (
    <ApiContext.Provider value={{ loading, api }}>
      {children}
    </ApiContext.Provider>
  )
}

export function useApi(): ApiContextData {
  const context = useContext(ApiContext)
  return context
}

import axios, { AxiosInstance } from 'axios'
import { NextPageContext } from 'next'
import router from 'next/router'
import { destroyCookie, parseCookies, setCookie } from 'nookies'

// import { api } from './api'
import { handleRefreshToken } from './refreshToken'

const getAPIClient = (
  _baseURL = 'dynamic',
  ctx?: NextPageContext
): AxiosInstance => {
  const { token, refreshToken, domain } = parseCookies(ctx)
  const baseURL =
    _baseURL === 'dynamic'
      ? domain || process.env.NEXT_PUBLIC_SERVICE
      : process.env.NEXT_PUBLIC_SERVICE

  //  console.log(`USE COOKIE :: ${token}, ${domain}`)
  // console.log ('ENV',process.env.NEXT_PUBLIC_SERVICE)

  const api = axios.create({
    baseURL: baseURL
  })

  api.interceptors.request.use(
    config => {
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )

  api.interceptors.response.use(
    response => {
      return response
    },
    async error => {
      if (error.response?.status === 401 && refreshToken) {
        try {
          const response = await handleRefreshToken(error, refreshToken)
          setCookie(ctx, 'token', response.data.token.accessToken, {
            maxAge: 60 * 60 * 1 // 1 hour
          })
          setCookie(ctx, 'refreshToken', response.data.token.refreshToken, {
            maxAge: 60 * 60 * 24 // 24 hours
          })

          api.defaults.headers.common.Authorization = `Bearer ${response.data.token.refreshToken}`
          return api(error.response.config)
          // return response
        } catch {
          redirectToLogin(ctx)
        }
      }
      if (error.response?.status === 401 && !refreshToken) {
        redirectToLogin(ctx)
      }

      return Promise.reject(error.response?.data)
    }
  )

  if (token && _baseURL === 'dynamic') {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  }

  return api
}

const redirectToLogin = (ctx?: NextPageContext) => {
  destroyCookie(ctx, 'token', { path: '/' })
  // destroyCookie(ctx, 'domain', { path: '/' })
  destroyCookie(ctx, 'refreshToken', { path: '/' })
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;'

  localStorage.removeItem('auth')
  // api.defaults.baseURL = process.env.NEXT_PUBLIC_SERVICE
  // // eslint-disable-next-line dot-notation
  // api.defaults.headers['Authorization'] = null

  if (ctx && ctx.res) {
    ctx.res.writeHead(302, { Location: '/login' })
    ctx.res.end()
  } else {
    router.push('/login')
  }
}

export default getAPIClient

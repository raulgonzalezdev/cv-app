import { useRouter } from 'next/dist/client/router'
import { destroyCookie, parseCookies, setCookie } from 'nookies'
import { createContext, useContext, useEffect, useState } from 'react'

import { ME } from '../constants/api-urls'
import { APP_DASHBOARD, LOGIN_PATH } from '../constants/routes'
import DefaultProps from '../interfaces/default.props'
import { User } from '../interfaces/user'
import { useApi } from './useApi'

interface AuthContextData {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => Promise<void>
  login: (user: User, token: string) => Promise<void>
  refreshUser: (user: User) => Promise<void>
}

const AuthContext = createContext({} as AuthContextData)

export const AuthProvider: React.FC<DefaultProps> = ({ children }) => {
  const tokenKey = '@reavel.token'
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const { api } = useApi()

  useEffect(() => {
    const { [tokenKey]: token } = parseCookies()
    const loggedUser = localStorage.getItem('user')

    if (token && router.pathname === LOGIN_PATH) {
      router.push(APP_DASHBOARD)
    }
    if (loggedUser) {
      setUser(JSON.parse(loggedUser))
    } else {
      logout()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function refreshUser(user: User) {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
      setUser(user)
    }
  }

  async function login(user: User, token: string) {
    setUser(user)
    console.log(user)
    localStorage.setItem('user', JSON.stringify(user))
    setCookie(undefined, tokenKey, token, {
      path: LOGIN_PATH,
      maxAge: 60 * 60 * 6 // 6 hours
    })

    router.push(APP_DASHBOARD)
  }

  async function logout() {
    destroyCookie(undefined, tokenKey)
    localStorage.setItem('user', JSON.stringify(null))
    setUser(null)

    router.push(LOGIN_PATH)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext)
  return context
}

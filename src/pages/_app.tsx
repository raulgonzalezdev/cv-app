import '../styles/font-family.css'
import 'codemirror/lib/codemirror.css'

import { ChakraProvider } from '@chakra-ui/react'
import { AppProps } from 'next/app'

import { theme } from '../config/theme'
import { ApiProvider } from '../hooks/useApi'
import { AuthProvider } from '../hooks/useAuth'

if (typeof window === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config()
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <ApiProvider>
          <Component {...pageProps} />
        </ApiProvider>
      </AuthProvider>
    </ChakraProvider>
  )
}

export default MyApp

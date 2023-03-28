import { Button, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { SubmitButton } from 'formik-chakra-ui'
import Link from 'next/link'
import { BiLock, BiUser } from 'react-icons/bi'
import * as Yup from 'yup'
import { useAuth } from '../hooks/useAuth'
import Logo from '../assets/logo.svg'
import InputIconControl from '../components/form/InputIconControl'
import InputPasswordControl from '../components/form/InputPasswordControl'
import SeoInfo from '../components/SeoInfo'
import { AUTH_LOGIN } from '../constants/api-urls'
import { useApi } from '../hooks/useApi'

import UserAuth from '../interfaces/userAuth'

const initialValues: Pick<UserAuth, 'email' | 'password'> = {
  email: '',
  password: ''
}

const validationSchema = Yup.object().shape({
  email: Yup.string().email('E-mail inválido').required('E-mail obrigatório'),
  password: Yup.string()
    .min(6, 'Mínimo 6 caracteres')
    .required('Senha obrigatória')
})

const AppPages: React.FC = () => {
  const { api } = useApi()
  const { login } = useAuth()

  const onSubmit = async (values: Pick<UserAuth, 'email' | 'password'>) => {
    console.log(AUTH_LOGIN)
    const { data } = await api.post(AUTH_LOGIN, values)
    login(data.user, data.token.access)
  }

  return (
    <SeoInfo title="Login">
      <Flex h="100vh" align="center" justify="center" bg="brand.50">
        <VStack w="full" maxW="417px" align="center" spacing={8}>
          <Logo style={{ transform: 'scale(1.3)', marginBottom: 10 }} />
          <VStack w="full" spacing={8} p={8} bg="white" borderRadius={10}>
            <VStack w="full" spacing={2}>
              <Heading
                as="h3"
                textColor="brandDark.800"
                size="md"
                fontWeight="medium"
                py={0}
              >
                Bem vindo
              </Heading>
              <Text textColor="brandDark.300" fontSize="sm">
                Insira seus dados de acesso
              </Text>
            </VStack>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              validateOnBlur={false}
              validateOnChange={false}
              onSubmit={onSubmit}
            >
              {() => (
                <VStack as={Form} w="full" spacing={3}>
                  <InputIconControl
                    name="email"
                    icon={BiUser}
                    inputProps={{
                      placeholder: 'Digite seu email',
                      fontSize: 'sm',
                      borderColor: 'brandDark.100'
                    }}
                    errorMessageProps={{ fontSize: 'sm' }}
                  />
                  <InputPasswordControl
                    name="password"
                    icon={BiLock}
                    inputProps={{
                      placeholder: 'Digite sua senha',
                      fontSize: 'sm',
                      borderColor: 'brandDark.100'
                    }}
                    errorMessageProps={{ fontSize: 'sm' }}
                  />
                  <SubmitButton
                    colorScheme="brand"
                    type="submit"
                    w="full"
                    fontSize="sm"
                  >
                    Entrar
                  </SubmitButton>
                </VStack>
              )}
            </Formik>
          </VStack>
          <Text fontSize="sm" textColor="brandDark.300">
            Esqueceu sua senha?{' '}
            <Link href="/reset-password" passHref>
              <Button as="a" variant="link" fontSize="sm" fontWeight="medium">
                Recuperar a senha
              </Button>
            </Link>
          </Text>
        </VStack>
      </Flex>
    </SeoInfo>
  )
}

export default AppPages

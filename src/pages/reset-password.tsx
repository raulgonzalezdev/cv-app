import { Button, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { SubmitButton } from 'formik-chakra-ui'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { BiUser } from 'react-icons/bi'
import * as Yup from 'yup'

import Logo from '../assets/logo.svg'
import InputIconControl from '../components/form/InputIconControl'
import SeoInfo from '../components/SeoInfo'
import { AUTH_REQUEST_PASSWORD_RESET } from '../constants/api-urls'
import { useApi } from '../hooks/useApi'
import UserAuth from '../interfaces/userAuth'

const initialValues: Pick<UserAuth, 'email'> = {
  email: ''
}

const validationSchema = Yup.object().shape({
  email: Yup.string().email('E-mail inválido').required('E-mail obrigatório')
})

const ResetPasswordPages: React.FC = () => {
  const { api } = useApi()
  const router = useRouter()

  const onSubmit = async (value: Pick<UserAuth, 'email'>) => {
    await api.post(AUTH_REQUEST_PASSWORD_RESET, value)
    router.push(AUTH_REQUEST_PASSWORD_RESET)
  }

  return (
    <SeoInfo title="Recuperar senha">
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
                Recuperar senha
              </Heading>
              <Text textColor="brandDark.300" fontSize="sm" align="center">
                Insira os dados de e-mail que enviaremos instruções para
                recuperar sua senha
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
                  <SubmitButton
                    colorScheme="brand"
                    type="submit"
                    w="full"
                    fontSize="sm"
                  >
                    Enviar
                  </SubmitButton>
                </VStack>
              )}
            </Formik>
          </VStack>
          <Text fontSize="sm" textColor="brandDark.300">
            Lembrei minha senha.{' '}
            <Link href="/" passHref>
              <Button as="a" variant="link" fontSize="sm">
                Voltar para login
              </Button>
            </Link>
          </Text>
        </VStack>
      </Flex>
    </SeoInfo>
  )
}

export default ResetPasswordPages

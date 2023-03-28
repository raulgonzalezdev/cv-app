import {
  Avatar,
  Button,
  Grid,
  GridItem,
  Heading,
  HStack,
  Input,
  InputGroup,
  Text
} from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { InputControl } from 'formik-chakra-ui'
import React, { useMemo, useRef } from 'react'
import * as Yup from 'yup'

import AppLayout from '../components/AppLayout'
import { AVATAR, ME } from '../constants/api-urls'
import { useApi } from '../hooks/useApi'
import { useAuth } from '../hooks/useAuth'

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Nome obrigatório')
})

const validators = Yup.object().shape({
  file: Yup.mixed()
    .nullable()
    .default(null)
    .test(
      'fileSize',
      'Arquivo deve ter no máximo 5MB',
      value => value === null || (value && value.size <= 5 * 1024 * 1024)
    )
})

const AppDashboardPage: React.FC = () => {
  const { user, refreshUser } = useAuth()
  const { api } = useApi()
  const onSubmit = values => {
    console.log(values)
  }

  const papel = useMemo(() => {
    switch (user?.role) {
      case 'ADM':
        return 'Administrador'
      case 'ENG':
        return 'Analista'
      case 'CUS':
        return 'Usuários'
      default:
        return 'Analista'
    }
  }, [user?.role])

  const formRef = useRef()
  const inputRef = useRef<HTMLInputElement>()
  const initialValues = {
    file: ''
  }

  const avatar = useRef<HTMLInputElement>()
  const onChangeFile = formRef => {
    if (formRef.current) {
      formRef.current.handleSubmit()
    }
  }

  return (
    <AppLayout title="Meu Perfil">
      <Heading
        as="h2"
        fontSize="2xl"
        fontWeight="semibold"
        textColor="brandDark.800"
        mb={'10px'}
      >
        Meu Perfil
      </Heading>
      <HStack py={6} spacing={6}>
        <Avatar size="xl" src={user?.avatar} name={user?.name}></Avatar>

        <Formik
          initialValues={initialValues}
          validationSchema={validators}
          innerRef={formRef}
          onSubmit={onSubmit}
        >
          {({ values, setFieldValue }) => (
            <InputGroup>
              <Input
                onChange={event => {
                  // setFieldValue('file', event.currentTarget.files[0])
                  console.log(event.currentTarget.files[0])
                  const formData = new FormData()
                  formData.append('file', event.currentTarget.files[0])
                  api
                    .patch(AVATAR(user.id), formData, {
                      headers: {
                        'Content-Type': 'multipart/form-data'
                      }
                    })
                    .then(async () => {
                      const response = await api.get(ME())
                      refreshUser(response?.data).then()
                    })
                }}
                id={'file'}
                type="file"
                name="file"
                ref={inputRef}
                display="none"
              />
              <Button
                colorScheme="blue"
                size="sm"
                onClick={() => inputRef.current.click()}
              >
                Upload avatar
              </Button>
            </InputGroup>
          )}
        </Formik>
      </HStack>
      <Formik
        initialValues={user}
        validationSchema={validationSchema}
        validateOnBlur={false}
        validateOnChange={false}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {() => (
          <Grid as={Form} templateColumns="repeat(2, 1fr)" gap={6}>
            <GridItem w="100%">
              <Text fontWeight={'semibold'}>Nome</Text>
              <InputControl
                name="name"
                inputProps={{
                  placeholder: 'Digite o seu nome',
                  fontSize: 'sm',
                  borderColor: 'brandDark.100'
                }}
                isDisabled
              />
            </GridItem>
            <GridItem w="100%">
              <Text fontWeight={'semibold'}>Email</Text>
              <InputControl
                name="email"
                inputProps={{
                  placeholder: 'Digite o seu email',
                  fontSize: 'sm',
                  borderColor: 'brandDark.100'
                }}
                isDisabled
              />
            </GridItem>
            <GridItem w="100%">
              <Text fontWeight={'semibold'}>Perfil de acesso</Text>
              <Text>{papel}</Text>
            </GridItem>
          </Grid>
        )}
      </Formik>
    </AppLayout>
  )
}

export default AppDashboardPage

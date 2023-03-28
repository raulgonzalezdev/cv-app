/* eslint-disable react/jsx-key */
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Tooltip,
  useToast
} from '@chakra-ui/react'
import { Select } from 'chakra-react-select'
import { Form, Formik } from 'formik'
import { InputControl, SubmitButton } from 'formik-chakra-ui'
import router from 'next/router'
import React, { useState } from 'react'
import { BiHide, BiShow } from 'react-icons/bi'
import * as Yup from 'yup'

import {
  AUTH_REGISTER,
  AVATAR,
  REVEAL_USERS_ID
} from '../../constants/api-urls'
import { useApi } from '../../hooks/useApi'
// import { useUser } from '../../hooks/useUsers'
import { User } from '../../interfaces/user'
import AppLayout from '../AppLayout'
import DateFormat from '../dateFormat'

interface UserManagementProps {
  data?: User
  onSave: (user: User) => void
  mutate?: () => void
}

const validators = Yup.object().shape({
  id: Yup.number(),
  name: Yup.string().required('Campo obrigatório'),
  email: Yup.string().email('Email invalido').required('Campo obrigatório'),
  Password: Yup.string().when('id', {
    is: 0,
    then: Yup.string()
      .min(8, 'A senha deve ter pelo menos 8 caracteres')
      .max(30, 'A senha não deve ser maior que 30 caracteres')
      .required('É necessária uma senha')
  }),
  confirmPassword: Yup.string().when('id', {
    is: 0,
    then: Yup.string()
      .oneOf([Yup.ref('Password'), null], 'As senhas devem corresponder')
      .required('É necessário confirmar a senha')
  })
})

const AddEdit: React.FC<UserManagementProps> = ({
  onSave,
  data: user,
  mutate
}) => {
  const { api } = useApi()
  const row = user
  const id = user?.id
  const [showPassword, setShowPassword] = useState(false)
  const initialValues = row || {
    id: 0,
    name: '',
    avatar: '',
    email: '',
    Password: '',
    confirmPassword: '',
    date_joined: null,
    last_login: null,
    is_active: false,
    role: ''
  }
  const toast = useToast()

  const roles = [
    {
      id: 'ADM',
      name: 'Administrador'
    },
    {
      id: 'CUS',
      name: 'Usuários'
    },
    {
      id: 'ENG',
      name: 'Analista'
    }
  ]

  const valueLabelapps = []
  roles?.forEach(role => {
    const label = role.name
    valueLabelapps.push({
      value: role.id,
      label: label
    })
  })
  const changeAvatar = async (file: string | Blob) => {
    const formData = new FormData()
    !!file && formData.append('file', file)
    const { data } = await api.patch(AVATAR(user.id), formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    onSave(data)
    mutate()
  }

  const validateUser = values => {
    let validUser = true
    const validationMessage = []
    const msg = 'Senha de confirmação não é igual a senha inserida'

    if (values.Password !== values.confirmPassword) {
      validUser = false

      validationMessage.push(msg)
    }

    if (!validUser) {
      toast({
        status: 'error',
        description: 'Senha de confirmação não é igual a senha inserida',

        isClosable: true
      })
    }
    return validUser
  }

  const onSubmit = async values => {
    if (!validateUser(values)) return
    if (values.id) {
      try {
        await api.patch(`${REVEAL_USERS_ID(id)}`, {
          name: values.name,
          is_active: values.is_active,
          password: values.Password,
          email: values.email,
          role: values.role
        })

        // onSave(data)
        toast({
          status: 'success',
          description: 'Usuário atualizado com sucesso',
          isClosable: true
        })
        // mutateallusers
        router.push(`/user`)
      } catch (error) {
        return toast({
          status: 'error',
          description: 'Erro ao salvar do usuário ',
          isClosable: true
        })
      }
      // mutateallusers
      mutate
    } else {
      // try {
      const usernew = {
        name: values.name,
        email: values.email,
        password: values.Password,
        password2: values.confirmPassword,
        role: values.role
      }

      const { data } = await api.post(`${AUTH_REGISTER}`, usernew)

      onSave(data)
      toast({
        status: 'success',
        description: 'Usuário criado com sucesso',
        isClosable: true
      })
      // mutateallusers
      router.push(`/user`)
      mutate

      // } catch (error) {
      //   return toast({
      //     status: 'error',
      //     description: 'Erro ao criar do usuário ',
      //     isClosable: true
      //   })
      // }
      // mutate()
    }
  }

  return (
    <>
      <AppLayout title={'Usuários'}>
        <Flex direction="column" w="calc(100vw - 279px)">
          <Flex>
            {/* Filter Sidebar */}

            <Box w="full" minH="100vh" bg="appBg" pt={2} pl={7} pr={6} pb={5}>
              <Flex justify="space-between">
                <Heading as="h1" size="lg" fontWeight="medium" mb={4}>
                  {user?.id ? row?.name : 'Novo Usuário'}
                </Heading>
              </Flex>
              <Spacer h={1} />
              <Tabs>
                {/* {row.attributes?.attributes?.id && ( */}
                <TabList>
                  <Tab
                    fontSize="14px"
                    w={'130px'}
                    borderWidth={'2px'}
                    borderColor={'gray.100'}
                    borderEndRadius={'5px'}
                    borderLeftWidth={'1px'}
                    backgroundColor={'white'}
                    _selected={{
                      borderRightWidth: '2px',
                      borderLeftWidth: '2px',
                      color: 'blue.400',
                      bg: 'rgba(118,61,242,0.1)',
                      borderColor: 'blue.400'
                    }}
                  >
                    Geral
                  </Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    <Formik
                      enableReinitialize={true}
                      initialValues={initialValues}
                      validationSchema={validators}
                      onSubmit={onSubmit}
                    >
                      {({ values, setFieldValue }) => (
                        <Form>
                          <HStack
                            spacing={3}
                            p={3}
                            bg="appBg"
                            borderRadius={9}
                            w="full"
                          >
                            <label>
                              <Input
                                onChange={event =>
                                  changeAvatar(event.currentTarget.files[0])
                                }
                                id="fleavatar"
                                type="file"
                                name="avatar"
                                display="none"
                              />
                              <Tooltip
                                hasArrow
                                label={'Clique no Avatar, para mudar a imagem'}
                                bg="black"
                                color="#fff"
                              >
                                <Avatar
                                  size="md"
                                  cursor="pointer"
                                  name={values?.name}
                                  src={values?.avatar}
                                  colorScheme="purple"
                                />
                              </Tooltip>
                            </label>
                            <Tag
                              size="md"
                              key="lg"
                              fontSize="14px"
                              fontStyle="Bold"
                              variant="solid"
                              cursor={'pointer'}
                              colorScheme={values?.is_active ? 'green' : 'gray'}
                              onClick={() => {
                                setFieldValue('is_active', !values?.is_active)
                              }}
                            >
                              {values?.is_active ? 'ATIVO' : 'PENDENTE'}
                            </Tag>
                          </HStack>

                          <HStack
                            w="full"
                            m={'20px 0px'}
                            spacing={5}
                            align="flex-start"
                          >
                            <Box className={'css-1kxonj9'}>
                              <FormLabel htmlFor="name">Nome{' * '}</FormLabel>
                              <InputControl
                                name="name"
                                inputProps={{
                                  placeholder: 'Nome do usuario'
                                }}
                                isDisabled={false}
                              />
                            </Box>
                            <Box className={'css-1kxonj9'}>
                              <FormLabel htmlFor="email">
                                E-mail{' * '}{' '}
                              </FormLabel>
                              <InputControl
                                name="email"
                                inputProps={{
                                  placeholder: 'E-mail do colaborador'
                                }}
                                isDisabled={false}
                              />
                            </Box>
                          </HStack>
                          <HStack
                            w="full"
                            m={'20px 0px'}
                            spacing={5}
                            align="flex-start"
                          >
                            <Box className={'css-1kxonj9'}>
                              <FormControl p={1} role={''}>
                                <FormLabel fontSize="sm">
                                  Role {' * '}
                                </FormLabel>
                                <Select
                                  name="role"
                                  placeholder="Selecione role "
                                  closeMenuOnSelect={true}
                                  // loadOptions={loadOptions}
                                  defaultValue={valueLabelapps.find(
                                    x => x.value === values.role
                                  )}
                                  options={valueLabelapps}
                                  size="md"
                                  noOptionsMessage={() =>
                                    'Nenhum tipo role encontrado'
                                  }
                                  onChange={val =>
                                    val.value &&
                                    setFieldValue('role', val.value)
                                  }
                                />
                              </FormControl>
                            </Box>
                          </HStack>
                          {!user?.id && (
                            <HStack
                              w="full"
                              m={'20px 0px'}
                              spacing={5}
                              align="flex-start"
                            >
                              <InputGroup>
                                <Box className={'css-1kxonj9'}>
                                  <FormLabel htmlFor="Password">
                                    Senha{' * '}
                                  </FormLabel>

                                  <InputControl
                                    name="Password"
                                    inputProps={{
                                      type: showPassword ? 'text' : 'password',
                                      placeholder: 'Password'
                                    }}
                                    isDisabled={false}
                                  />
                                  <Tooltip
                                    hasArrow
                                    label={
                                      showPassword ? 'Esconder' : 'Visualizar'
                                    }
                                    bg="black"
                                    color="#fff"
                                  >
                                    <InputRightElement
                                      top="29px"
                                      onClick={() =>
                                        setShowPassword(!showPassword)
                                      }
                                    >
                                      <Icon
                                        cursor="pointer"
                                        as={showPassword ? BiHide : BiShow}
                                        color="gray.600"
                                        fontSize="lg"
                                      />
                                    </InputRightElement>
                                  </Tooltip>
                                </Box>
                              </InputGroup>
                              <InputGroup>
                                <Box className={'css-1kxonj9'}>
                                  <FormLabel htmlFor="confirmPassword">
                                    Confirmar Senha{' * '}
                                  </FormLabel>

                                  <InputControl
                                    name="confirmPassword"
                                    inputProps={{
                                      type: showPassword ? 'text' : 'password',
                                      placeholder: 'Confirmar senha'
                                    }}
                                    isDisabled={false}
                                  />
                                  <Tooltip
                                    hasArrow
                                    label={
                                      showPassword ? 'Esconder' : 'Visualizar'
                                    }
                                    bg="black"
                                    color="#fff"
                                  >
                                    <InputRightElement
                                      top="29px"
                                      onClick={() =>
                                        setShowPassword(!showPassword)
                                      }
                                    >
                                      <Icon
                                        cursor="pointer"
                                        as={showPassword ? BiHide : BiShow}
                                        color="gray.600"
                                        fontSize="lg"
                                      />
                                    </InputRightElement>
                                  </Tooltip>
                                </Box>
                              </InputGroup>
                            </HStack>
                          )}

                          <HStack
                            w="full"
                            spacing={5}
                            align="flex-start"
                            m={'20px 0px'}
                          >
                            <Box className={'css-1kxonj9'}>
                              <FormLabel htmlFor="criadoem">
                                Criado em
                              </FormLabel>
                              <DateFormat
                                start={values?.date_joined}
                                format="dd/MM/yyyy hh:mm:ss"
                                hasIcon
                              />
                            </Box>

                            <Box className={'css-1kxonj9'}>
                              <FormLabel htmlFor="ultimoacesso">
                                Último acesso
                              </FormLabel>

                              <DateFormat
                                start={values?.last_login}
                                format="dd/MM/yyyy hh:mm:ss"
                                hasIcon
                              />
                            </Box>
                          </HStack>
                          <HStack
                            w="full"
                            spacing={10}
                            align="flex-start"
                            m={'20px 0px'}
                          >
                            <Button
                              colorScheme="gray"
                              onClick={() => router.push(`/user`)}
                            >
                              Retornar
                            </Button>
                            <SubmitButton
                              colorScheme="messenger"
                              m={'20px 0px'}
                            >
                              {id ? 'Salvar' : 'Criar'}
                            </SubmitButton>
                          </HStack>
                        </Form>
                      )}
                    </Formik>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </Flex>
        </Flex>
      </AppLayout>
    </>
  )
}

export default AddEdit

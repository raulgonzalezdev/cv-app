import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  AvatarGroup,
  Box,
  Button,
  HStack,
  Icon,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
  Portal,
  Spacer,
  Text,
  useDisclosure,
  useToast,
  VStack
} from '@chakra-ui/react'
import { GetStaticPaths, GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import { BiPlay } from 'react-icons/bi'

import AddTeamMemberModal from '../../../../components/AddTeamMemberModal'
import AppLayout from '../../../../components/AppLayout'
import AllowDepartmentModal from '../../../../components/department/AllowDepartmentModal'
import EditableWithControls from '../../../../components/EditableWithControls'
import EnvConfig from '../../../../components/EnvConfig'
import ProjectPropertyItem from '../../../../components/ProjectPropertyItem'
import SelectVersion from '../../../../components/SelectVersion'
import StreamlitView from '../../../../components/StreamlitView'
import TagSelector from '../../../../components/tags/TagSelector'
import Tools from '../../../../components/Tools'
import {
  REVEAL_APP_BY_ID,
  REVEAL_PUBLISH_APP,
  STREAMLIT_SERVER
} from '../../../../constants/api-urls'
import { proxyUrl } from '../../../../constants/proxy-urls'
import { APP_DASHBOARD } from '../../../../constants/routes'
import { useApi } from '../../../../hooks/useApi'
import { useLastVersionByApp } from '../../../../hooks/useVersion'

export interface AppProjectEditPageProps {
  instance_id: string
}

function getVersions(end: number) {
  const myArray = []
  for (let i = end; i >= 0; i -= 1) {
    myArray.push(i)
  }
  return myArray
}

const AppProjectEditPage: React.FC<AppProjectEditPageProps> = props => {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()
  const {
    isOpen: isTeamOpen,
    onOpen: onOpenTeam,
    onClose: onCloseTeam
  } = useDisclosure()
  const {
    isOpen: isDepOpen,
    onOpen: onOpenDep,
    onClose: onCloseDep
  } = useDisclosure()

  const {
    isOpen: isOpenView,
    onOpen: onOpenView,
    onClose: onCloseView
  } = useDisclosure()

  const [onPublish, setOnPublish] = useState(false)
  const [openTest, setOpenTest] = useState(false)
  const { api } = useApi()
  const router = useRouter()
  const { app_version, mutate } = useLastVersionByApp(props.instance_id)
  const [appName, setAppName] = useState('')
  const CodeWithCodemirror = useMemo(() => {
    if (router.isReady) {
      return dynamic(import('../../../../components/CodeEditor'), {
        ssr: false
      })
    }
  }, [router.isReady])

  useEffect(() => {
    setAppName(app_version?.app_detail.name)
  }, [app_version, router.isReady])

  if (router.isFallback || !router.isReady || !app_version) {
    return <Text>loading</Text>
  }

  const handleKillPublish = async () => {
    if (STREAMLIT_SERVER === proxyUrl) {
      if (openTest) {
        await fetch(`${proxyUrl}/instance/kill/${props.instance_id}/`)
        await api.post(REVEAL_PUBLISH_APP(app_version.app_detail.instance_id))
      }
      setOpenTest(!openTest)
      onOpenView()
    } else {
      setOpenTest(true)
      setTimeout(() => {
        onOpenView()
        setOpenTest(false)
      }, 100)
    }
  }
  const handlePublish = async () => {
    setOnPublish(true)
    await api.post(REVEAL_PUBLISH_APP(app_version.app_detail.instance_id))
    router.push(APP_DASHBOARD)
  }

  const handleSaveApp = async (id: string) => {
    await api.patch(REVEAL_APP_BY_ID(id), {
      name: appName
    })
    mutate()
    toast({
      title: 'App Salvo',
      description: 'Alterações salvas com sucesso',
      status: 'success',
      duration: 5000,
      isClosable: true
    })
  }

  const titles =
    app_version?.app_detail?.name +
      ' | Version: ' +
      app_version?.version_number || 'Reveal Streamlit App'

  return (
    <>
      <AppLayout title="Dashboard" noPadding>
        <HStack h="full" w="full" spacing="2px" align="flex-start">
          <VStack
            w="290px"
            spacing={5}
            px={1}
            py={5}
            bg="white"
            minH="full"
            align="flex-start"
          >
            <VStack w="full" align="flex-start" spacing={2}>
              {/*
            //TODO - Adicionar customização nos ícones
          */}
              <Avatar
                borderRadius={10}
                bg="brand.100"
                size="lg"
                fontWeight="bold"
                name="New Project"
                textColor="brand.800"
                mx={3}
                // icon={<Icon as={BiPrinter} fontSize={34} fill="brand.800" />}
              />
              {/* <Input placeholder="Basic usage" /> */}
              <EditableWithControls
                defaultValue={app_version?.app_detail.name}
                value={appName}
                onChange={(newName: string) => {
                  setAppName(newName)
                }}
                ml={-4}
                fontWeight="medium"
                placeholder="Nome do projeto"
              />
            </VStack>

            <ProjectPropertyItem title="Versões">
              <SelectVersion
                instance_id={props.instance_id}
                versions={getVersions(app_version?.last_version)}
              />
            </ProjectPropertyItem>
            <ProjectPropertyItem title="Tags">
              <TagSelector onSave={mutate} app={app_version?.app_detail} />
            </ProjectPropertyItem>
            <ProjectPropertyItem title="Chaves de código">
              <EnvConfig app={app_version?.app_detail} onSave={mutate} />
            </ProjectPropertyItem>
            <Tools instance_id={props.instance_id} titles={titles} />
            <Spacer />
            <HStack>
              <Popover>
                <PopoverTrigger>
                  <Button>Voltar</Button>
                </PopoverTrigger>
                <Portal>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverBody>
                      <Text>Deseja realmente voltar? </Text>
                      <Text>Isso apagará os dados não salvos</Text>
                    </PopoverBody>
                    <PopoverFooter>
                      <HStack>
                        <Link href="/app/dashboard">
                          <Button colorScheme="green">Confirmar</Button>
                        </Link>
                      </HStack>
                    </PopoverFooter>
                  </PopoverContent>
                </Portal>
              </Popover>
              <Button onClick={() => handleSaveApp(app_version?.app_detail.id)}>
                Salvar
              </Button>
            </HStack>
          </VStack>
          <VStack w="full" minH="full" spacing="2px">
            <HStack w="full" h="6vh" bg="white" px={5} py={3} spacing={2}>
              <IconButton
                aria-label="play"
                icon={<Icon as={BiPlay} />}
                fontSize={'18px'}
                onClick={handleKillPublish}
              />

              <Button onClick={handlePublish}>Publicar</Button>
              <Button colorScheme="red" onClick={onOpen}>
                Deletar
              </Button>

              <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
              >
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                      Deletar
                    </AlertDialogHeader>

                    <AlertDialogBody>
                      Você tem certeza que deseja realizar está ação ? Este
                      comando não poderá ser desfeito.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                      <Button ref={cancelRef} onClick={onClose}>
                        Cancelar
                      </Button>
                      <Button
                        colorScheme="red"
                        onClick={async () => {
                          api
                            .delete(REVEAL_APP_BY_ID(app_version.app))
                            .then(() => {
                              router.push('/app/dashboard')
                            })
                        }}
                        ml={3}
                      >
                        Deletar
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
              <Spacer />
              <AvatarGroup size="xs" max={2} spacing={'-1.5'}>
                <Avatar
                  src={app_version.app_detail?.team?.owner.avatar}
                  name={app_version.app_detail?.team?.owner.name}
                />
                {app_version.app_detail?.team?.members.map(member => (
                  <Avatar
                    src={member.avatar}
                    key={member.id}
                    name={member.name}
                  />
                ))}
              </AvatarGroup>
              <Popover>
                <PopoverTrigger>
                  <Button
                    color="brand.500"
                    bg="brand.50"
                    _hover={{ color: 'white', bg: 'brand.500' }}
                  >
                    Convidar
                  </Button>
                </PopoverTrigger>
                <PopoverContent width="fit-content">
                  <PopoverArrow />
                  <PopoverBody>
                    <VStack>
                      <Text
                        w="100%"
                        p={2}
                        as="button"
                        _hover={{
                          color: 'brand.500',
                          bg: 'brand.50'
                        }}
                        onClick={onOpenTeam}
                      >
                        Colaboradores
                      </Text>
                      <Text
                        p={2}
                        w="100%"
                        as="button"
                        _hover={{
                          color: 'brand.500',
                          bg: 'brand.50'
                        }}
                        onClick={onOpenDep}
                      >
                        Departamentos
                      </Text>
                    </VStack>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </HStack>
            <Box w="full" flex={1} bg="white">
              {CodeWithCodemirror && (
                <CodeWithCodemirror
                  instance_id={props.instance_id}
                  version_number={app_version?.version_number}
                  onPublish={onPublish}
                  openTest={openTest}
                />
              )}
            </Box>
          </VStack>
        </HStack>
      </AppLayout>
      {isOpenView && (
        <StreamlitView
          isOpen={isOpenView}
          onClose={onCloseView}
          title={titles}
          instance_id={props.instance_id}
        />
      )}

      <AddTeamMemberModal
        isOpen={isTeamOpen}
        onClose={onCloseTeam}
        team={app_version.app_detail.team}
      />
      <AllowDepartmentModal
        isOpen={isDepOpen}
        onClose={onCloseDep}
        app={app_version.app_detail}
      />
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  return {
    props: params
  }
}

export default AppProjectEditPage

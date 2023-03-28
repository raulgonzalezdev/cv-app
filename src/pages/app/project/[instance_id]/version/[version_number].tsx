import {
  Avatar,
  Box,
  Button,
  HStack,
  Icon,
  IconButton,
  Spacer,
  Text,
  useDisclosure,
  VStack
} from '@chakra-ui/react'
import { GetStaticPaths, GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import { BiArrowBack, BiPlay } from 'react-icons/bi'

import AppLayout from '../../../../../components/AppLayout'
import ProjectPropertyItem from '../../../../../components/ProjectPropertyItem'
import SelectVersion from '../../../../../components/SelectVersion'
import StreamlitView from '../../../../../components/StreamlitView'
import TagSelector from '../../../../../components/tags/TagSelector'
import Tools from '../../../../../components/Tools'
import { APP_PROJECT_EDIT } from '../../../../../constants/routes'
import { useVersionByApp } from '../../../../../hooks/useVersion'

export interface AppProjectEditPageProps {
  instance_id: string
  version_number: string
}
function getVersions(end: number) {
  const myArray = []
  for (let i = end; i >= 0; i -= 1) {
    myArray.push(i)
  }
  return myArray
}
const AppProjectEditPage: React.FC<AppProjectEditPageProps> = props => {
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { app_version, mutate } = useVersionByApp(
    props.instance_id,
    props.version_number
  )
  const CodeViwer = useMemo(() => {
    if (router.isReady) {
      return dynamic(import('../../../../../components/CodeViewer'), {
        ssr: false
      })
    }
  }, [router.isReady])

  if (router.isFallback || !router.isReady || !app_version) {
    return <Text>loading</Text>
  }

  const titles =
    app_version?.app_detail?.name +
      ' | Version: ' +
      app_version?.version_number || 'Reveal Streamlit App'

  return (
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
            <Text ml={-4} fontWeight="medium">
              {app_version?.app_detail?.name}
            </Text>
          </VStack>
          <ProjectPropertyItem title="Versões">
            <SelectVersion
              instance_id={props.instance_id}
              versions={getVersions(
                app_version?.last_version
                  ? app_version?.last_version - 1
                  : app_version?.last_version
              )}
            />
          </ProjectPropertyItem>
          <ProjectPropertyItem title="Tags">
            <TagSelector onSave={mutate} app={app_version?.app_detail} />
          </ProjectPropertyItem>
          <Tools instance_id={props.instance_id} titles={titles} />
        </VStack>
        <VStack w="full" minH="full" spacing="2px">
          <HStack w="full" h="6vh" bg="white" px={5} py={3} spacing={2}>
            <Button
              color="brand.500"
              bg="brand.50"
              leftIcon={<Icon as={BiArrowBack}></Icon>}
              _hover={{ color: 'white', bg: 'brand.500' }}
              onClick={() => {
                router.push(APP_PROJECT_EDIT(props.instance_id))
              }}
            >
              Ir para versão atual
            </Button>
            <Spacer />
            <IconButton
              aria-label="play"
              icon={<Icon as={BiPlay} />}
              fontSize={'18px'}
              onClick={() => {
                onOpen()
              }}
            />
          </HStack>
          <Box w="full" fontSize="20px" flex={1} bg="white">
            {CodeViwer && <CodeViwer code={app_version?.code} />}
          </Box>
        </VStack>
      </HStack>
      {isOpen && (
        <StreamlitView
          isOpen={isOpen}
          onClose={onClose}
          title={titles}
          instance_id={app_version.app_detail.instance_id}
        />
      )}
    </AppLayout>
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

import {
  Box,
  Button,
  HStack,
  Icon,
  IconButton,
  Link,
  Spacer,
  Text,
  useDisclosure,
  VStack
} from '@chakra-ui/react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import { BiFile, BiInfoCircle, BiLeftArrowAlt } from 'react-icons/bi'

import AppLayout from '../../../../components/AppLayout'
import InfoModal from '../../../../components/InfoModal'
import { STREAMLIT_SERVER } from '../../../../constants/api-urls'
import { proxyUrl } from '../../../../constants/proxy-urls'
import { APP_PROJECT_EDIT } from '../../../../constants/routes'
import { useLastVersionByApp } from '../../../../hooks/useVersion'

export interface AppProjectInstancePageProps {
  instance_id: string
}

const AppProjectInstancePage: React.FC<AppProjectInstancePageProps> = props => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter()
  const { app_version } = useLastVersionByApp(props.instance_id)
  console.log(STREAMLIT_SERVER)

  if (router.isFallback || !router.isReady) {
    return <Text>loading</Text>
  }

  return (
    <AppLayout title="DataApp" noPadding>
      <HStack h="full" w="full" spacing="2px" align="flex-start">
        <VStack w="full" minH="full" spacing="2px">
          <HStack w="full" h="60px" bg="white" px={5} py={3} spacing={2}>
            <Link href="/app/dashboard">
              <IconButton
                color="brand.500"
                bg="transparent"
                _hover={{}}
                aria-label="info"
                icon={<Icon as={BiLeftArrowAlt} />}
                fontSize={'24px'}
              ></IconButton>
            </Link>
            <Icon
              as={BiFile}
              color="brand.500"
              bg="brand.50"
              p={'5px'}
              fontSize={'34px'}
              borderRadius={'5px'}
            ></Icon>
            <Text fontWeight={'semibold'}>{app_version?.app_detail?.name}</Text>
            <Spacer />
            <Button
              color="brand.500"
              bg="brand.50"
              _hover={{ color: 'white', bg: 'brand.500' }}
              onClick={async () => {
                router.push(APP_PROJECT_EDIT(props.instance_id))
              }}
            >
              Editar
            </Button>
            <IconButton
              color="brand.500"
              bg="brand.50"
              _hover={{ color: 'white', bg: 'brand.500' }}
              aria-label="info"
              icon={<Icon as={BiInfoCircle} />}
              fontSize={'18px'}
              onClick={onOpen}
            ></IconButton>
          </HStack>
          <Box
            w="full"
            h="93vh"
            as="iframe"
            sandbox="allow-same-origin allow-scripts allow-forms allow-top-navigation allow-popups allow-modals"
            src={
              STREAMLIT_SERVER === proxyUrl
                ? `${proxyUrl}/instance/${props.instance_id}/`
                : `${STREAMLIT_SERVER}`
            }
          ></Box>
        </VStack>
      </HStack>
      <InfoModal version={app_version} isOpen={isOpen} onClose={onClose} />
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

export default AppProjectInstancePage

import { Flex, Spinner } from '@chakra-ui/react'
import Head from 'next/head'
import React from 'react'

import AppLayout from './AppLayout'

const PageShellLoading: React.FC = () => {
  return (
    <>
      <Head>
        <title>Carregando... | UNIQ</title>
      </Head>
      <Flex h="100vh">
        <AppLayout title="Usuarios">
          <Flex
            flex={1}
            align="center"
            justify="center"
            minH="100vh"
            bg="appBg"
            pt={12}
            pl={7}
            pr={6}
            pb={12}
          >
            <Spinner colorScheme="messenger" />
          </Flex>
        </AppLayout>
      </Flex>
    </>
  )
}

export default PageShellLoading

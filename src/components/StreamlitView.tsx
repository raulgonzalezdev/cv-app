import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex
} from '@chakra-ui/react'
import React from 'react'

import { STREAMLIT_SERVER } from '../constants/api-urls'
import { proxyUrl } from '../constants/proxy-urls'

type StreamlitViewAlertProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  instance_id: string
}

const StreamlitView: React.FC<StreamlitViewAlertProps> = ({
  isOpen,
  onClose,
  title,
  instance_id
}) => {
  const cancelRef = React.useRef()
  const titles = title ? title : 'Reveal Streamlit App'
  return (
    <Drawer
      // placement="top"
      initialFocusRef={cancelRef}
      onClose={onClose}
      isOpen={isOpen}
      size="full"
      closeOnOverlayClick={true}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">{titles}</DrawerHeader>
        <DrawerCloseButton />
        <DrawerBody>
          {/* <Flex h="100vh" align="center" justify="center" bg="brand.50"> */}
          <Flex
            // h="100vh"
            w="full"
            h="93vh"
            maxW="100%"
            align="center"
            justify="center"
            as="iframe"
            sandbox="allow-same-origin allow-scripts allow-forms allow-top-navigation allow-popups allow-modals"
            src={
              STREAMLIT_SERVER === proxyUrl
                ? `${proxyUrl}/instance/${instance_id}/`
                : `${STREAMLIT_SERVER}`
            }
            frameBorder="0"
          />
          {/* </Flex> */}
        </DrawerBody>
        <DrawerFooter>
          <Button colorScheme="blue" variant="outline" mr={3} onClick={onClose}>
            Voltar para Visualizador de código
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default StreamlitView

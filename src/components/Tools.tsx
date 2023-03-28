import { EmailIcon, SearchIcon } from '@chakra-ui/icons'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Grid,
  GridItem,
  Icon,
  IconButton,
  Spacer,
  Tooltip,
  useDisclosure
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React from 'react'

import { MAIN_MENU_TOOLS } from '../constants/tools'
import { useAuth } from '../hooks/useAuth'
import { MenuItem } from '../interfaces/tools'
import ChatGpt from './ChatGpt'
import StreamlitView from './StreamlitView'

const ToolsMenuItem: React.FC<MenuItem> = props => {
  const router = useRouter()
  const {
    isOpen: isOpenChat,
    onOpen: onOpenChat,
    onClose: onCloseChat
  } = useDisclosure()

  const {
    isOpen: isOpenView,
    onOpen: onOpenView,
    onClose: onCloseView
  } = useDisclosure()

  const handleClick = () => {
    // Abrir el formulario modal aquí
    if (props.path.startsWith('Modal')) {
      switch (props.path) {
        case 'ModalChatGPT':
          onOpenChat()
          break
        case 'ModalPlayApp':
          onOpenView()
          break

        default:
          // Si el valor de `props.path` no coincide con ninguno de los casos anteriores, aquí puedes agregar cualquier comportamiento adicional que necesites
          break
      }
    } else {
      router.push(props.path)
    }
  }

  return (
    <>
      <Tooltip label={props.name}>
        <IconButton
          width="32px"
          height="32px"
          aria-label="Search database"
          icon={<Icon as={props.icon} fontSize="16px" />}
          onClick={handleClick}
        />
      </Tooltip>
      {isOpenChat && (
        <ChatGpt isOpen={isOpenChat} onClose={onCloseChat} title={props.name} />
      )}
      {isOpenView && (
        <StreamlitView
          isOpen={isOpenView}
          onClose={onCloseView}
          title={props.titles}
          instance_id={props.instance_id}
        />
      )}
    </>
  )
}

interface Props {
  instance_id: string
  titles: string
}

const Tools: React.FC<Props> = ({ instance_id, titles }) => {
  const { user } = useAuth()

  return (
    <Accordion height="100px" defaultIndex={[0]} allowToggle>
      <AccordionItem>
        <AccordionButton>
          <Box
            as="h3"
            fontSize="sm"
            fontWeight="semibold"
            textColor="gray.600"
            flex="1"
            textAlign="left"
          >
            Ferramentas do editor
          </Box>
          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel
          pb={6}
          height="100px"
          overflowY="scroll"
          style={{ width: '100%', display: 'flex' }}
        >
          <Grid
            h="200px"
            templateRows="repeat(6, 1fr)"
            templateColumns="repeat(6, 1fr)"
            gap={1}
          >
            {MAIN_MENU_TOOLS[user?.role]?.map(item => (
              // eslint-disable-next-line react/jsx-key
              <GridItem
                //
                colSpan={1}
                display="flex"
                flexDirection="column"
                // alignItems="center"
                // gap={1}
              >
                <ToolsMenuItem
                  key={item.path}
                  {...item}
                  instance_id={instance_id}
                  titles={titles}
                />
              </GridItem>
            ))}
          </Grid>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
export default Tools

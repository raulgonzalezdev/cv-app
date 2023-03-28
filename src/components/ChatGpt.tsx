import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormLabel,
  HStack,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
  useToast
} from '@chakra-ui/react'
import axios from 'axios'
import dynamic from 'next/dynamic'
import React, { useEffect, useMemo, useState } from 'react'

import { REVEAL_CHATGPT } from '../constants/api-urls'

type ChatGptProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
}

const ChatGpt: React.FC<ChatGptProps> = ({ isOpen, onClose, title }) => {
  const CodeWithCodemirror = useMemo(() => {
    return dynamic(import('./CodeEditorChat'), {
      ssr: false
    })
  }, [])
  const cancelRef = React.useRef()
  const titles = title ? title : 'Reveal Streamlit App'
  const toast = useToast()
  const [response, setResponse] = useState('')
  const [formattedText, setFormattedText] = useState('')
  const [value, setValue] = React.useState('')
  const [loading, setLoading] = useState(false)
  const handleChange = event => setValue(event.target.value)

  const removeSlashes = (text: string) => {
    return text.replace(/[\/\\#]/g, '-')
  }

  const handleSubmit = async () => {
    setLoading(true)
    const prompt = removeSlashes(value)
    let error = null
    let response = null

    try {
      response = await axios.get(REVEAL_CHATGPT(prompt), {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    } catch (e) {
      error = e
      setResponse(error)
    }

    if (response && response.data) {
      setResponse(response.data.response)
      setFormattedText(response.data.response)
    } else {
      setResponse(null)
    }
    setLoading(false)
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: 'Texto copiado para a área de transferência.',
      status: 'info',
      duration: 2000,
      isClosable: true
    })
  }

  return (
    <>
      <Drawer
        initialFocusRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        size="lg"
        closeOnOverlayClick={true}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">{titles}</DrawerHeader>
          <DrawerCloseButton />
          <DrawerBody>
            <Stack spacing="24px">
              <Box>
                <FormLabel htmlFor="In">Formule aqui sua exigência</FormLabel>
                <Textarea
                  style={{ width: '100%' }}
                  size="sm"
                  value={value}
                  onChange={handleChange}
                  placeholder="Exemplo: Preciso de um modelo
                de código python streamlit, Topic (Variação de Temperatura) que leia os dados
                de um arquivo de texto, e faça um gráfico dos pontos que saem da faixa definida
                como aumento ou diminuição da temperatura...."
                />
              </Box>
            </Stack>

            <Stack spacing="24px">
              <Box>
                <Tabs>
                  <TabList>
                    <Tab>Codigo</Tab>
                    <Tab>Texto</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <Flex
                        // h="100vh"
                        w="full"
                        h="62vh"
                        maxW="100%"
                        align="center"
                        justify="center"
                      >
                        <CodeWithCodemirror text={response} />
                      </Flex>
                    </TabPanel>

                    <TabPanel>
                      <Flex
                        // h="100vh"
                        w="full"
                        h="62vh"
                        maxW="100%"
                        align="center"
                        justify="center"
                      >
                        <Textarea
                          style={{ height: '100%', width: '100%' }}
                          size="sm"
                          value={response}
                        />
                      </Flex>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </Stack>
          </DrawerBody>
          <DrawerFooter>
            <HStack w="full" h="6vh" bg="white" px={5} py={3} spacing={2}>
              {loading ? (
                <Spinner size="sm" color="blue" thickness="4px" speed="0.65s" />
              ) : (
                <>
                  <Button colorScheme="blue" onClick={handleSubmit}>
                    Envie um pedido
                  </Button>
                  {response ? (
                    <>
                      <Button
                        colorScheme="blue"
                        onClick={() => handleCopy(formattedText)}
                      >
                        Copiar Resultados
                      </Button>
                    </>
                  ) : null}
                </>
              )}
              <Button
                colorScheme="blue"
                variant="outline"
                mr={3}
                onClick={onClose}
              >
                Voltar para código
              </Button>
            </HStack>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default ChatGpt

import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Spacer,
  Switch,
  VStack
} from '@chakra-ui/react'
import { useColorMode } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

const Header = ({ lang, setLang, toggleColorMode, setEditable, editable }) => {
  const router = useRouter()
  const { colorMode } = useColorMode()

  const handleLanguageChange = () => {
    const newLang = lang === 'es' ? 'en' : 'es'
    setLang(newLang)
    router.push({
      pathname: router.pathname,
      query: { ...router.query, lang: newLang }
    })
  }

  const handleEditableChange = () => {
    const newEditable = !editable
    setEditable(newEditable)
    console.log(newEditable)

    router.push({
      pathname: router.pathname,
      query: { ...router.query, editable: newEditable.toString() }
    })
  }

  return (
    <Box
      w="100%"
      bg="teal.500"
      p={2}
      color="white"
      boxShadow="md"
      rounded="md"
      mb={2}
      mt={-6} // Add this line to move the Box up
    >
      <Flex>
        <Avatar
          name="Raul Gonzalez"
          src="https://bit.ly/2B4zGwE" // Reemplaza esta URL por la URL de la foto de perfil que deseas usar
          mr={4}
        />
        <Heading as="h1" size="lg">
          Raul Gonzalez - CV
        </Heading>
        <Spacer />
        <VStack spacing={2}>
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="language-switch" mb="0">
              {lang === 'es' ? 'Español' : 'English'}
            </FormLabel>
            <Switch
              id="language-switch"
              isChecked={lang === 'en'}
              onChange={handleLanguageChange}
            />
          </FormControl>
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="color-mode-switch" mb="0">
              {colorMode === 'light' ? 'Light' : 'Dark'}
            </FormLabel>
            <Switch
              id="color-mode-switch"
              isChecked={colorMode === 'dark'}
              onChange={toggleColorMode}
            />
          </FormControl>
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="editable-switch" mb="0">
              {editable ? 'Editar Plantilla' : 'Vista Final'}
            </FormLabel>
            <Switch
              id="editable-switch"
              isChecked={editable}
              onChange={handleEditableChange}
            />
          </FormControl>
        </VStack>
      </Flex>
    </Box>
  )
}

export default Header

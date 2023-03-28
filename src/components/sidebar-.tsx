import {
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Spacer,
  Text,
  VStack
} from '@chakra-ui/react'
import Link from 'next/link'
import React, { useState } from 'react'
import { IconType } from 'react-icons'
import { BiCog, BiLogOut, BiPlay, BiUser } from 'react-icons/bi'

interface SidebarItemProps {
  icon: IconType
  label: string
  isCollapsed: boolean
  path: string
}

const SidebarItem: React.FC<SidebarItemProps> = props => {
  return (
    <Link href={props.path} passHref>
      <HStack
        as="a"
        spacing={2}
        w={props.isCollapsed ? 'auto' : 'full'}
        p={3}
        role="group"
        _hover={{ bg: 'blue.50' }}
        borderRadius={6}
      >
        <Icon
          as={props.icon}
          fontSize="22px"
          color="gray.800"
          _groupHover={{ color: 'blue.500' }}
        />
        {!props.isCollapsed && (
          <Text
            fontSize="sm"
            fontWeight="medium"
            color="gray.800"
            _groupHover={{ color: 'blue.500' }}
          >
            {props.label}
          </Text>
        )}
      </HStack>
    </Link>
  )
}

const Sidebar = () => {
  const items = [
    { icon: BiCog, label: 'Dashboard', path: '/' },
    { icon: BiCog, label: 'Minhas Aplicações', path: '/' },
    { icon: BiCog, label: 'Todas as Aplicações', path: '/' },
    { icon: BiCog, label: 'Ultimas Acessadas', path: '/' },
    { icon: BiCog, label: 'Favoritas', path: '/' },
    { icon: BiCog, label: 'Recentes', path: '/' },
    { icon: BiCog, label: 'Área de Negocio', path: '/' }
  ]
  const [isCollapsed, setIsCollapsed] = useState(true)

  return (
    <VStack
      bg="gray.200"
      align="flex-start"
      onClick={() => {
        setIsCollapsed(!isCollapsed)
      }}
    >
      <Flex px={3} pt={5}>
        <Text>Logo</Text>
      </Flex>
      <VStack w={'full'} h={'full'} p={3}>
        {isCollapsed ? (
          <IconButton
            colorScheme="blue"
            aria-label="Novo Projeto"
            borderRadius={6}
            icon={<Icon as={BiPlay} fontSize={18} />}
          ></IconButton>
        ) : (
          <Button
            as="a"
            colorScheme="blue"
            w={'full'}
            leftIcon={<Icon as={BiPlay} fontSize={18} />}
            fontSize={12}
            target="_blank"
          >
            Novo Projeto
          </Button>
        )}

        {items.map(item => (
          <SidebarItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            path={item.path}
            isCollapsed={isCollapsed}
          />
        ))}
        <Spacer></Spacer>
        <SidebarItem
          icon={BiUser}
          label="Meu Perfil"
          path={'/'}
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          icon={BiLogOut}
          label="Log Out"
          path={'/'}
          isCollapsed={isCollapsed}
        />
      </VStack>
    </VStack>
  )
}

export default Sidebar

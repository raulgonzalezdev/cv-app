import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Spacer,
  Text,
  Tooltip,
  useDisclosure,
  VStack
} from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { BiCodeAlt, BiLogOutCircle } from 'react-icons/bi'

import Logo from '../assets/logo.svg'
import { MAIN_MENU_ITEMS } from '../constants/sidebar'
import { useAuth } from '../hooks/useAuth'
import { MenuItem } from '../interfaces/sidebar'
import NewProjectModal from './NewProjectModal'

interface CreateProjectButtonProps {
  isCollapsed: boolean
}

const CreateProjectButton: React.FC<CreateProjectButtonProps> = ({
  isCollapsed
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <div style={{ cursor: 'pointer' }}>
        <Box px={6} w={isCollapsed ? 'auto' : 'full'}>
          {isCollapsed ? (
            <IconButton
              aria-label="Novo Projeto"
              borderRadius={6}
              h="44px"
              icon={<Icon as={BiCodeAlt} fontSize="20px" />}
              onClick={onOpen}
            ></IconButton>
          ) : (
            <Button
              as="a"
              leftIcon={<Icon as={BiCodeAlt} fontSize="20px" />}
              rounded="full"
              fontWeight="semibold"
              fontSize="sm"
              width="full"
              h="44px"
              onClick={onOpen}
            >
              Novo projeto
            </Button>
          )}
        </Box>
      </div>
      <NewProjectModal isOpen={isOpen} onClose={onClose}></NewProjectModal>
    </>
  )
}

const SidebarMenuItem: React.FC<MenuItem> = props => {
  const router = useRouter()

  const isHovering = {
    color: 'brand.500',
    bg: 'brand.50'
  }

  const isSelected = router.pathname.startsWith(props.path)
    ? {
        borderRightWidth: 4,
        borderRightColor: 'brand.500',
        ...isHovering
      }
    : null

  return (
    <Link href={props.path} passHref>
      <HStack
        as="a"
        w={props.isCollapsed ? 'auto' : 'full'}
        spacing={3}
        px={6}
        py={3}
        textColor="brandDark.400"
        _hover={isHovering}
        {...isSelected}
      >
        <Icon as={props.icon} fontSize="22px" />
        {!props.isCollapsed && (
          <Text fontSize="sm" fontWeight="semibold">
            {props.name}
          </Text>
        )}
      </HStack>
    </Link>
  )
}

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)
  return (
    <Flex
      as="nav"
      w={isCollapsed ? 'auto' : 'full'}
      maxW="279px"
      minH="100vh"
      bg="white"
    >
      <VStack
        spacing={8}
        w="full"
        flex="1"
        maxH="100vh"
        overflowY="auto"
        py={4}
        onClick={() => {
          // console.log(user)
          setIsCollapsed(!isCollapsed)
        }}
      >
        <Box>
          <Logo />
        </Box>
        <VStack w="full" h="full" spacing={6}>
          {user?.role == 'ADM' && (
            <CreateProjectButton isCollapsed={isCollapsed} />
          )}
          {user?.role == 'ENG' && (
            <CreateProjectButton isCollapsed={isCollapsed} />
          )}
          <VStack w="full" h="full" spacing={0}>
            {MAIN_MENU_ITEMS[user?.role]?.map(item => (
              <SidebarMenuItem
                key={item.path}
                isCollapsed={isCollapsed}
                {...item}
              />
            ))}
            <Spacer />

            <Link href="/my-profile" passHref>
              <HStack
                as="a"
                w={isCollapsed ? 'auto' : 'full'}
                spacing={3}
                px={6}
                py={3}
                textColor="brandDark.400"
                _hover={{
                  color: 'brand.500',
                  bg: 'brand.50'
                }}
              >
                <Avatar size="xs" src={user?.avatar} name={user?.name}></Avatar>
                {!isCollapsed && (
                  <Text fontSize="sm" fontWeight="semibold">
                    {user?.name}
                  </Text>
                )}
              </HStack>
            </Link>

            <Tooltip hasArrow label="Fazer logout" bg="gray.300" color="black">
              <HStack
                w={isCollapsed ? 'auto' : 'full'}
                spacing={3}
                px={6}
                py={3}
                cursor="pointer"
                textColor="brandDark.400"
                _hover={{
                  color: 'brand.500',
                  bg: 'brand.50'
                }}
                onClick={logout}
              >
                <Icon as={BiLogOutCircle} fontSize="22px" />
                {!isCollapsed && (
                  <Text fontSize="sm" fontWeight="semibold">
                    Fazer logout
                  </Text>
                )}
              </HStack>
            </Tooltip>
          </VStack>
          <Spacer />
        </VStack>
      </VStack>
    </Flex>
  )
}

export default Sidebar

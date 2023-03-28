/* eslint-disable react-hooks/exhaustive-deps */
import { SearchIcon } from '@chakra-ui/icons'
import {
  Avatar,
  Box,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Spacer,
  Text,
  useDisclosure,
  VStack
} from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { BiPencil, BiPlus, BiTrash } from 'react-icons/bi'

import AppLayout from '../../components/AppLayout'
import DateFormat from '../../components/dateFormat'
import DeleteAlert from '../../components/deleteAlert'
import Paginate from '../../components/paginate'
import StatusTag from '../../components/statusTag'
import TableServer from '../../components/tableServer'
import { REVEAL_USERS_ID } from '../../constants/api-urls'
import { useUser } from '../../hooks/useUsers'
import { User } from '../../interfaces/user'

const Usuarios: React.FC = () => {
  const [modalId, setModalId] = useState<string>()

  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete
  } = useDisclosure()

  const router = useRouter()

  const { users, meta, isLoading, mutate } = useUser()

  const data = React.useMemo(() => users || [], [users])
  const pagina = React.useMemo(() => meta || [], [meta])

  const handleDeleteUsers = id => {
    setModalId(id)
    onOpenDelete()
  }
  const handlePaginate = event => {
    router.push(
      `${router.pathname}?pageNumber=${event.selected + 1}
      `
    )
  }

  const getRole = (role: any) => {
    switch (role) {
      case 'ADM':
        return 'Administrador'
      case 'ENG':
        return 'Analista'
      case 'CUS':
        return 'Usuários'
      default:
        return 'Analista'
    }
  }

  const [value, setValue] = useState('')
  const [usuarios, setUsers] = useState(data)

  useEffect(() => {
    let filteredUsers = data
    if (value.length > 0) {
      filteredUsers = filteredUsers.filter(row => {
        return Object.values(row)
          .join('')
          .toLowerCase()
          .includes(value.toLowerCase())
      })
    }

    setUsers(filteredUsers)
  }, [usuarios, data, value])

  const columns = React.useMemo(
    () => [
      {
        id: 'nome',
        Header: 'nome',
        width: '250px',
        accessor: (row: User) => (
          <Link href={`/user/${row.id}`} passHref>
            <HStack spacing={3} bg="white" borderRadius={7} w="full">
              <Avatar
                size="sm"
                name={row?.name}
                src={row?.avatar}
                colorScheme="messenger"
              />
              <VStack spacing={1} w="full" align="flex-start">
                <Heading
                  as="h4"
                  size="xs"
                  fontSize="12px"
                  fontWeight={400}
                  color="6E6B76"
                >
                  <Text fontSize="14px" as="b">
                    {row?.name || 'Sem nome'}
                  </Text>
                  <Text fontSize="12px">{row.email}</Text>
                </Heading>
              </VStack>
            </HStack>
          </Link>
        )
      },
      {
        id: 'perfil',
        Header: 'perfil',
        width: '300px',
        accessor: (row: User) => (
          <Link href={`/user/${row.id}`} passHref>
            <div style={{ cursor: 'pointer' }}>
              <Text fontSize="12px">{getRole(row.role)}</Text>
            </div>
          </Link>
        )
      },
      {
        id: 'create_at',
        Header: 'Creado As',
        width: '150px',
        accessor: (row: User) => (
          <Link href={`/user/${row.id}`} passHref>
            <DateFormat
              start={row.date_joined}
              format="dd/MM/yyyy hh:mm"
              hasIcon
            />
          </Link>
        )
      },
      {
        id: 'last_login',
        Header: 'Ultimo Acceso',
        width: '150px',
        accessor: (row: User) => (
          <Link href={`/user/${row.id}`} passHref>
            <DateFormat
              start={row.last_login}
              format="dd/MM/yyyy hh:mm"
              hasIcon
            />
          </Link>
        )
      },

      {
        id: 'status',
        Header: 'status',
        width: '250px',
        accessor: (row: User) => (
          <Link href={`/user/${row.id}`} passHref>
            <StatusTag active={row.is_active} />
          </Link>
        )
      },
      {
        id: 'actions',
        Header: () => null,
        width: '100px',
        disableSortBy: true,
        accessor: (row: User) => (
          <>
            <IconButton
              aria-label="Apagar Usuarios"
              variant="ghost"
              colorScheme="messenger"
              icon={<BiTrash fontSize={20} />}
              onClick={() => handleDeleteUsers(row.id)}
            />

            <IconButton
              aria-label="Editar Usuarios"
              variant="ghost"
              colorScheme="messenger"
              icon={<BiPencil fontSize={20} />}
              onClick={() => router.push(`/user/${row.id}`)}
            />
          </>
        )
      }
    ],
    []
  )

  return (
    <AppLayout title="Usuarios">
      <Flex h="40px" align="center" p="16px" justify="space-between">
        <Heading as="h4" size="md">
          Usuarios
        </Heading>
        <HStack>
          <HStack px={3} py={3} spacing={8}>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                // eslint-disable-next-line react/no-children-prop
                children={<SearchIcon color="gray.300" />}
              />

              <Input
                name="name"
                size="sm"
                type="Search"
                placeholder="Digite para buscar"
                value={value}
                onChange={e => {
                  setValue(e.target.value)
                }}
              />
            </InputGroup>
            <IconButton
              aria-label="Criar Usuários"
              icon={<Icon as={BiPlus} fontSize="lg" />}
              size="sm"
              colorScheme="messenger"
              onClick={() => router.push(`/user/add`)}
              /* onClick={onOpen} */
            />
          </HStack>
        </HStack>
      </Flex>

      {/* Tabela */}
      <Box>
        <TableServer
          url="/user"
          columns={columns}
          data={usuarios}
          isLoading={isLoading}
        />
        <Spacer h={2} />
        <Paginate
          handlePaginate={handlePaginate}
          itemsPerPage={pagina?.pagination?.per_page}
          pages={pagina?.pagination?.pages}
        />
        {isOpenDelete && (
          <DeleteAlert
            modelName={'Usuário'}
            isOpen={isOpenDelete}
            onClose={onCloseDelete}
            deleteAPI={REVEAL_USERS_ID(modalId)}
            mutate={mutate}
          />
        )}
      </Box>
    </AppLayout>
  )
}

export default Usuarios

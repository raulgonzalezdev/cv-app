import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  HStack,
  Icon,
  IconButton,
  Input,
  Spacer,
  Text,
  useDisclosure,
  VStack
} from '@chakra-ui/react'
import { useState } from 'react'
import { BiCrown, BiPlus, BiTrash, BiWindowClose } from 'react-icons/bi'
import AsyncSelect from 'react-select/async'

import DepartmentDeleteModal from '../../components/department/DepartmentDeleteModal'
import {
  REVEAL_DEPARTMENTS,
  REVEAL_DEPARTMENTS_BY_ID
} from '../../constants/api-urls'
import { useApi } from '../../hooks/useApi'
import { useDepartments } from '../../hooks/useDepartment'
import { User } from '../../interfaces/user'

const DepartmentList: React.FC = () => {
  const {
    isOpen: isOpenDel,
    onClose: onCloseDel,
    onOpen: onOpenDel
  } = useDisclosure()
  const { api } = useApi()
  const { departments, mutate } = useDepartments()
  const [newDepName, setNewDepName] = useState('')
  const [newDepOwner, setNewDepOwner] = useState('')
  const [newDepMember, setNewDepMember] = useState('')

  const [selectedDepartmentId, setSelectedDepartmentId] = useState('')

  const selectOwnerStyles = {
    option: provided => ({
      ...provided,
      overflowY: 'visible',
      height: '30px',
      width: '320px',
      fontSize: '12px'
    }),
    control: provided => ({
      ...provided,
      height: '30px',
      width: '320px',
      fontSize: '12px'
    }),
    valueContainer: provided => ({
      ...provided,
      width: '320px',
      fontSize: '12px'
    })
  }

  const loadOptions = (inputValue: string, callback: (options) => void) => {
    api
      .get('api/reveal/user/', {
        params: {
          search: inputValue
        }
      })
      .then(response => {
        const valueLabel = response.data.results?.map(user => ({
          value: user.id,
          label: user.name
        }))
        callback(valueLabel)
      })
  }
  return (
    <>
      <VStack spacing="20px">
        <VStack w="100%">
          <Text fontWeight="medium" w="100%">
            Novo Departamento
          </Text>
          <HStack h="30px" w="100%" spacing="5px" fontSize="sm">
            <Input
              value={newDepName}
              onChange={e => {
                setNewDepName(e.target.value)
              }}
              placeholder="Digite o nome do departamento"
              size="sm"
            />
            <AsyncSelect
              styles={selectOwnerStyles}
              closeMenuOnSelect
              loadOptions={loadOptions}
              defaultOptions
              placeholder="Digíte o nome do chefe do departamento"
              noOptionsMessage={() => 'Nenhum usuario encontrado'}
              onChange={(val: { value: string; label: string }) => {
                setNewDepOwner(val.value)
              }}
            />
            <IconButton
              aria-label="Novo Departamento"
              size="sm"
              icon={<Icon as={BiPlus} />}
              onClick={() => {
                api.post(REVEAL_DEPARTMENTS, {
                  name: newDepName,
                  owner: newDepOwner
                })
                mutate()
              }}
            />
          </HStack>
        </VStack>
        {departments?.map(dep => (
          <Accordion
            key={dep.id}
            w="100%"
            borderBottomWidth="0px"
            allowMultiple
          >
            <AccordionItem borderY="0" bg="transparent">
              <AccordionButton borderBottomWidth="1px">
                <IconButton
                  aria-label="Deletar Departamento"
                  variant="ghost"
                  colorScheme="messenger"
                  icon={<BiTrash fontSize={20} />}
                  onClick={() => {
                    setSelectedDepartmentId(dep.id)
                    onOpenDel()
                    mutate()
                  }}
                />
                <Box flex="1" fontWeight="semibold" textAlign="left">
                  {dep.name}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel borderBottomWidth="0px" pb={4}>
                <VStack>
                  <HStack h="30px" w="100%" spacing="5px" fontSize="sm">
                    <Text fontWeight="medium">Adicionar membro</Text>
                    <Spacer />
                    <AsyncSelect
                      styles={selectOwnerStyles}
                      closeMenuOnSelect
                      loadOptions={loadOptions}
                      defaultOptions
                      placeholder="Digíte o nome do membro"
                      noOptionsMessage={() => 'Nenhum usuario encontrado'}
                      onChange={(val: { value: string; label: string }) => {
                        setNewDepMember(val.value)
                      }}
                    />
                    <IconButton
                      aria-label="Adicionar Membro"
                      size="sm"
                      icon={<Icon as={BiPlus} />}
                      onClick={async () => {
                        await api.patch(REVEAL_DEPARTMENTS_BY_ID(dep.id), {
                          member: [...dep.member, newDepMember]
                        })
                        mutate()
                      }}
                    />
                  </HStack>
                  <HStack w="100%">
                    <Avatar
                      name={dep.owner_detail?.name}
                      src={dep.owner_detail?.avatar}
                    />
                    <Text>{dep.owner_detail?.name}</Text>
                    <Spacer />
                    <Icon as={BiCrown} color="yellow.400"></Icon>
                  </HStack>
                  {dep.members?.map((member: User) => (
                    <HStack key={member.id} w="100%">
                      <Avatar name={member.name} src={member.avatar} />
                      <Text>{member.name}</Text>
                      <Spacer />
                      <Icon
                        as={BiWindowClose}
                        color="red"
                        onClick={async () => {
                          await api.patch(REVEAL_DEPARTMENTS_BY_ID(dep.id), {
                            member: dep.member.filter(
                              value => value != member.id
                            )
                          })
                          mutate()
                        }}
                      ></Icon>
                    </HStack>
                  ))}
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        ))}
      </VStack>
      {isOpenDel && (
        <DepartmentDeleteModal
          isOpen={isOpenDel}
          onClose={onCloseDel}
          id={selectedDepartmentId}
          mutate={mutate}
        />
      )}
    </>
  )
}

export default DepartmentList

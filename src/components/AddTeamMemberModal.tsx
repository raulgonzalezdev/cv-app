import {
  Avatar,
  Button,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  VStack
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { BiCrown, BiWindowClose } from 'react-icons/bi'
import AsyncSelect from 'react-select/async'

import { REVEAL_TEAM_BY_ID } from '../constants/api-urls'
import { useApi } from '../hooks/useApi'
import Team from '../interfaces/team'
import { User } from '../interfaces/user'

interface AddTeamMemberModalProps {
  isOpen: boolean
  team: Team
  onClose: () => void
}

const AddTeamMemberModal: React.FC<AddTeamMemberModalProps> = ({
  isOpen,
  team,
  onClose
}) => {
  const [members, setMembers] = useState<User[]>([])
  const [defaultOptions, setDefaultOptions] = useState<
    {
      label: string
      value: number
    }[]
  >()
  const [membersOriginList, setMembersOriginList] = useState<User[]>([])

  const { api } = useApi()

  useEffect(() => {
    if (team?.members) {
      setMembers(team.members)
    }
  }, [team.members])

  const onSelect = (selected): void => {
    setDefaultOptions(
      membersOriginList
        .filter(
          value =>
            value.id != selected.value &&
            !members.some(member => member.id == value.id) &&
            value.id != team.owner.id
        )
        .map(user => ({
          value: Number(user.id),
          label: user.name
        }))
    )
    setMembers(
      membersOriginList.filter(
        value =>
          value.id == selected.value ||
          members.some(member => member.id == value.id)
      )
    )
  }

  const loadOptions = (inputValue: string, callback: (options) => void) => {
    api
      .get('api/reveal/user/', {
        params: {
          search: inputValue,
          role: 'ENG'
        }
      })
      .then(response => {
        const valueLabel = response.data.results
          .filter(
            item =>
              members.filter(value => value.id == item.id).length == 0 &&
              item.id != team.owner.id
          )
          .map(user => ({
            value: user.id,
            label: user.name
          }))
        setMembersOriginList(before => [...before, ...response.data.results])
        callback(valueLabel)
      })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Adicionar Colaboradores</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <AsyncSelect
            closeMenuOnSelect={false}
            loadOptions={loadOptions}
            defaultOptions={defaultOptions ? defaultOptions : true}
            placeholder="Digíte o nome do engenheiro"
            noOptionsMessage={() => 'Nenhum engenheiro encontrado'}
            onChange={val => onSelect(val)}
          />
          <Text fontWeight="semibold" fontSize="18px" mt="15px" mb="10px">
            Colaboradores
          </Text>
          <VStack w="100%">
            <HStack w="100%">
              <Avatar name={team?.owner?.name} src={team?.owner?.avatar} />
              <Text>{team?.owner?.name}</Text>
              <Spacer />
              <Icon as={BiCrown} color="yellow.400"></Icon>
            </HStack>
            {members?.map(member => (
              <HStack w="100%" key={member.id}>
                <Avatar name={member.name} src={member.avatar} />
                <Text>{member.name}</Text>
                <Spacer />
                <Icon
                  as={BiWindowClose}
                  color="red"
                  onClick={() => {
                    setDefaultOptions([
                      ...defaultOptions,
                      {
                        value: Number(member.id),
                        label: member.name
                      }
                    ])
                    setMembers(members.filter(value => value.id != member.id))
                  }}
                ></Icon>
              </HStack>
            ))}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            mr={3}
            onClick={() => {
              api.patch(REVEAL_TEAM_BY_ID(team.id), {
                member: members.map(value => value.id)
              })
              onClose()
            }}
          >
            Salvar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default AddTeamMemberModal

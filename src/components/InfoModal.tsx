import {
  Avatar,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  VStack
} from '@chakra-ui/react'
import { BiCrown } from 'react-icons/bi'

import { Version } from '../interfaces/version'
import TagList from './tags/TagList'

interface InfoModalProps {
  version: Version
  isOpen: boolean
  onClose: () => void
}
const InfoModal: React.FC<InfoModalProps> = ({ version, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader></ModalHeader>
        <ModalCloseButton />
        <ModalBody py={6}>
          <VStack spacing={5}>
            <VStack w="100%">
              <Text fontWeight="semibold" w="100%">
                Colaboradores
              </Text>
              <HStack w="100%">
                <Avatar
                  name={version?.app_detail?.team?.owner?.name}
                  src={version?.app_detail?.team?.owner?.avatar}
                />
                <Text fontWeight="semibold" w="100%">
                  {version?.app_detail?.team?.owner?.name}
                </Text>
                <Spacer />
                <Icon as={BiCrown} color="yellow.400"></Icon>
              </HStack>
              {version?.app_detail?.team.members?.map(member => (
                <HStack w="100%" key={member.id}>
                  <Avatar name={member.name} src={member.avatar} />
                  <Text fontWeight="semibold" w="100%">
                    {member.name}
                  </Text>
                </HStack>
              ))}
            </VStack>
            <VStack w="100%">
              <Text fontWeight="semibold" w="100%">
                Versão
              </Text>
              <Text fontWeight="semibold" w="100%">
                {version?.version_number}
              </Text>
            </VStack>
            <VStack w="100%">
              <Text fontWeight="semibold" w="100%">
                Tags
              </Text>
              <TagList tags={version?.app_detail.tags} />
            </VStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default InfoModal

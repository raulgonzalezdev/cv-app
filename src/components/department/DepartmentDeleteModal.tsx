import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text
} from '@chakra-ui/react'
import React from 'react'

import { REVEAL_DEPARTMENTS_BY_ID } from '../../constants/api-urls'
import { useApi } from '../../hooks/useApi'

interface DepartmentDeleteModalProps {
  isOpen: boolean
  id: string
  mutate: () => void
  onClose: () => void
}

const DepartmentDeleteModal: React.FC<DepartmentDeleteModalProps> = ({
  isOpen,
  onClose,
  mutate,
  id
}) => {
  const { api } = useApi()
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Deletar Departamento</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize="sm">
            Você tem certeza que deseja realizar esta ação ?
          </Text>
          <Text fontSize="sm">Este comando não poderá ser desfeita.</Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button
            colorScheme="red"
            onClick={async () => {
              api.delete(REVEAL_DEPARTMENTS_BY_ID(id))
              mutate()
              onClose()
            }}
          >
            Deletar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default DepartmentDeleteModal

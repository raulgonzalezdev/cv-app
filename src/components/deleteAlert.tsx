import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useToast
} from '@chakra-ui/react'
import React from 'react'

import { useApi } from '../hooks/useApi'

type DeleteAlertProps = {
  modelName: string
  isOpen: boolean
  onClose: () => void
  deleteAPI: string
  mutate?: () => void
}

const DeleteAlert: React.FC<DeleteAlertProps> = ({
  modelName,
  isOpen,
  onClose,
  deleteAPI,
  mutate
}) => {
  const { api } = useApi()
  const cancelRef = React.useRef()
  const toast = useToast()
  const handleDelete = async () => {
    await api
      .delete(`${deleteAPI}`)
      .then(response => {
        onClose()
        toast({
          title: modelName + ' excluído.',
          status: 'info',
          isClosable: true
        })
        mutate()
      })
      .catch(function (error) {
        onClose()
        toast({
          title: 'Houve um erro ao excluir o ' + modelName,
          status: 'error',
          isClosable: true
        })
      })
  }
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Excluir {modelName}
          </AlertDialogHeader>

          <AlertDialogBody>
            Tem certeza que deseja excluir este(a) {modelName}?
            <br />
            Esta ação não poderá ser desfeita.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="red" onClick={handleDelete} ml={3}>
              Excluir
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

export default DeleteAlert

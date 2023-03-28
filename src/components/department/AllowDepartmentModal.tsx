import {
  Box,
  Button,
  Checkbox,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

import { REVEAL_APP_BY_ID } from '../../constants/api-urls'
import { useApi } from '../../hooks/useApi'
import { useDepartments } from '../../hooks/useDepartment'
import { DataApp } from '../../interfaces/dataApp'
import Department from '../../interfaces/department'

interface AllowDepartmentModalProps {
  app: DataApp
  isOpen: boolean
  onClose: () => void
}

const AllowDepartmentModal: React.FC<AllowDepartmentModalProps> = ({
  app,
  isOpen,
  onClose
}) => {
  const { api } = useApi()

  const [selectedDepartments, setSelectedDepartments] = useState<Department[]>(
    []
  )
  const { departments } = useDepartments()
  const data = React.useMemo<Department[]>(
    () => departments || [],
    [departments]
  )

  useEffect(() => {
    if (app?.departments) {
      setSelectedDepartments(app.departments)
    }
  }, [app?.departments])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader />
        <ModalCloseButton />
        <ModalBody py={6}>
          <VStack align={'start'}>
            <Text mb={2} fontWeight="semibold">
              Departamentos
            </Text>
            <VStack spacing={3} width="full">
              {data.map(dep => (
                <HStack key={dep.id} width={'full'}>
                  <Checkbox
                    isChecked={selectedDepartments.some(
                      sDepartment => sDepartment.id === dep.id
                    )}
                    value={dep.id.toString()}
                    width={'100%'}
                    mr={'10px'}
                    alignItems={'start'}
                    onChange={async e => {
                      if (e.target.checked) {
                        console.log('click', selectedDepartments)
                        setSelectedDepartments(before => [...before, dep])
                      } else {
                        console.log('unclick', selectedDepartments)
                        setSelectedDepartments(
                          selectedDepartments.filter(
                            sDepartment => sDepartment.id != dep.id
                          )
                        )
                      }
                    }}
                  >
                    <Text fontSize="sm" textColor="gray.600">
                      {dep.name}
                    </Text>
                  </Checkbox>
                </HStack>
              ))}
              <Box h={1} />
            </VStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => {
              api.patch(REVEAL_APP_BY_ID(app.id), {
                department: selectedDepartments.map(value => value.id)
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

export default AllowDepartmentModal

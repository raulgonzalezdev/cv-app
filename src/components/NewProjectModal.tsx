import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack
} from '@chakra-ui/react'
import { Form, Formik, FormikProps, FormikValues } from 'formik'
import { InputControl } from 'formik-chakra-ui'
import { useRouter } from 'next/dist/client/router'
import { useRef } from 'react'
import * as Yup from 'yup'

import { REVEAL_APPS } from '../constants/api-urls'
import { APP_PROJECT_EDIT } from '../constants/routes'
import { useApi } from '../hooks/useApi'

interface NewProjectModalProps {
  isOpen: boolean
  onClose: () => void
}
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Nome obrigatório')
})
const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose
}) => {
  const router = useRouter()
  const { api } = useApi()
  const formRef = useRef<FormikProps<FormikValues>>(null)

  const onSubmit = async (values: FormikValues) => {
    values['icon'] = 'icon'
    const { data } = await api.post(REVEAL_APPS, values)
    router.push(APP_PROJECT_EDIT(data.instance_id))
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Novo Projeto</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={{ name: '' }}
            validationSchema={validationSchema}
            validateOnBlur={false}
            validateOnChange={false}
            innerRef={formRef}
            onSubmit={onSubmit}
          >
            {() => (
              <VStack as={Form} w="full" spacing={3}>
                <InputControl
                  name="name"
                  inputProps={{
                    placeholder: 'Digite o nome do novo DataApp',
                    fontSize: 'sm',
                    borderColor: 'brandDark.100'
                  }}
                />
              </VStack>
            )}
          </Formik>
        </ModalBody>

        <ModalFooter>
          <Button
            mr={3}
            onClick={() => {
              formRef.current?.handleSubmit()
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

export default NewProjectModal

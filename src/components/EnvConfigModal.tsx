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
import { useRef } from 'react'
import * as Yup from 'yup'

import { REVEAL_ENV_CONFIG } from '../constants/api-urls'
import { useApi } from '../hooks/useApi'

interface EnvConfigModalProps {
  app_id: string
  isOpen: boolean
  onClose: () => void
}
const validationSchema = Yup.object().shape({
  key: Yup.string().required('Chave obrigatória'),
  value: Yup.string().required('Valor obrigatório')
})
const EnvConfigModal: React.FC<EnvConfigModalProps> = ({
  app_id,
  isOpen,
  onClose
}) => {
  const { api } = useApi()
  const formRef = useRef<FormikProps<FormikValues>>(null)

  const onSubmit = async (values: FormikValues) => {
    values['app'] = app_id
    await api.post(REVEAL_ENV_CONFIG, values)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Adicionar variavel de ambiente</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={{ key: '', value: '' }}
            validationSchema={validationSchema}
            validateOnBlur={false}
            validateOnChange={false}
            innerRef={formRef}
            onSubmit={onSubmit}
          >
            {() => (
              <VStack as={Form} w="full" spacing={3}>
                <InputControl
                  name="key"
                  inputProps={{
                    placeholder: 'Digite a chave',
                    fontSize: 'sm',
                    borderColor: 'brandDark.100'
                  }}
                />
                <InputControl
                  name="value"
                  inputProps={{
                    placeholder: 'Digite o valor',
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
            Adicionar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default EnvConfigModal

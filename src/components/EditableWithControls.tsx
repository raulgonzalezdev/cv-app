import {
  Button,
  ButtonGroup,
  Editable,
  EditablePreview,
  EditableProps,
  EditableTextarea,
  Icon,
  IconButton,
  Textarea,
  Tooltip,
  useColorModeValue,
  useEditableControls
} from '@chakra-ui/react'
import React from 'react'
import { BiX } from 'react-icons/bi'

function EditableControls() {
  const { isEditing, getSubmitButtonProps, getCancelButtonProps } =
    useEditableControls()

  return isEditing ? (
    <ButtonGroup justifyContent="end" size="sm" w="full" spacing={2} mt={2}>
      <IconButton
        aria-label="Cancelar"
        colorScheme="red"
        variant="ghost"
        icon={<Icon as={BiX} fontSize="lg" />}
        {...getCancelButtonProps()}
        borderRadius={3}
      />
      <Button
        size="sm"
        aria-label="Salvar"
        {...getSubmitButtonProps()}
        fontWeight="medium"
        borderRadius={3}
      >
        Salvar
      </Button>
    </ButtonGroup>
  ) : null
}

const EditableWithControls: React.FC<EditableProps> = props => {
  return (
    <Editable {...props}>
      <Tooltip label="Click para editar" hasArrow>
        <EditablePreview
          py={2}
          px={3}
          _hover={{
            background: useColorModeValue('gray.100', 'gray.700')
          }}
        />
      </Tooltip>
      <Textarea as={EditableTextarea} lineHeight="24px" py={2} px={3} />
      <EditableControls />
    </Editable>
  )
}

export default EditableWithControls

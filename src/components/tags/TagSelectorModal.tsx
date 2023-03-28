import {
  Box,
  Button,
  Center,
  Checkbox,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  SimpleGrid,
  Text,
  VStack
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { BiPlus, BiTrashAlt } from 'react-icons/bi'

import {
  REVEAL_APP_BY_ID,
  REVEAL_TAGS,
  REVEAL_TAGS_BY_ID
} from '../../constants/api-urls'
import { useApi } from '../../hooks/useApi'
import { useTags } from '../../hooks/useTag'
import AppTag from '../../interfaces/appTag'
import { DataApp } from '../../interfaces/dataApp'

interface TagSelectorModalProps {
  app: DataApp
  isOpen: boolean
  onClose: () => void
}
interface ColorPickerProps {
  currentColor: string
  onSelect: (color: string) => void
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  currentColor,
  onSelect
}) => {
  const colors = [
    'gray.500',
    'red.500',
    'gray.700',
    'green.500',
    'blue.500',
    'blue.800',
    'yellow.500',
    'orange.500',
    'purple.500',
    'pink.500'
  ]

  return (
    <Center>
      <Popover variant="picker">
        <PopoverTrigger>
          <Button
            aria-label={currentColor}
            background={currentColor}
            height="22px"
            width="22px"
            padding={0}
            minWidth="unset"
            _hover={{ background: currentColor }}
            borderRadius={3}
          ></Button>
        </PopoverTrigger>
        <PopoverContent width="170px">
          <PopoverBody>
            <SimpleGrid columns={5} spacing={2}>
              {colors.map(c => (
                <Button
                  key={c}
                  aria-label={c}
                  background={c}
                  height="22px"
                  width="22px"
                  padding={0}
                  minWidth="unset"
                  borderRadius={3}
                  _hover={{ background: c }}
                  onClick={() => {
                    onSelect(c)
                  }}
                ></Button>
              ))}
            </SimpleGrid>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Center>
  )
}

const TagSelectorModal: React.FC<TagSelectorModalProps> = ({
  app,
  isOpen,
  onClose
}) => {
  const { api } = useApi()

  const [inputName, setInputName] = useState('')
  const [inputColor, setInputColor] = useState('gray.500')
  const [selectedTags, setSelectedTags] = useState<AppTag[]>([])
  const { tags, mutate } = useTags()
  const data = React.useMemo<AppTag[]>(() => tags || [], [tags])

  useEffect(() => {
    if (app?.tags) {
      setSelectedTags(app.tags)
    }
  }, [app?.tags])

  const handlePostTag = async () => {
    const values = {
      name: inputName,
      color: inputColor
    }
    await api.post(REVEAL_TAGS, values)
    mutate()
    setInputName('')
    setInputColor('')
  }

  const handleDeleteTag = async id => {
    await api.delete(REVEAL_TAGS_BY_ID(id))
    mutate()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader />
        <ModalCloseButton />
        <ModalBody py={6}>
          <VStack align={'start'}>
            <Text mb={2} fontWeight="semibold">
              Tags
            </Text>

            <VStack spacing={3} width="full">
              {data?.map(tag => (
                <HStack key={tag.id} width={'full'}>
                  <Checkbox
                    isChecked={selectedTags.some(sTag => sTag.id === tag.id)}
                    value={tag.id.toString()}
                    width={'100%'}
                    mr={'10px'}
                    alignItems={'start'}
                    onChange={async e => {
                      if (e.target.checked) {
                        console.log('click', selectedTags)
                        setSelectedTags(before => [...before, tag])
                      } else {
                        console.log('unclick', selectedTags)
                        setSelectedTags(
                          selectedTags.filter(sTag => sTag.id != tag.id)
                        )
                      }
                    }}
                  >
                    <Text fontSize="sm" textColor="gray.600">
                      {tag.name}
                    </Text>
                  </Checkbox>
                  <Button
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => handleDeleteTag(tag.id)}
                    leftIcon={<Icon as={BiTrashAlt} fontSize="20px" />}
                  >
                    Excluir
                  </Button>
                </HStack>
              ))}
              <Box h={1} />
            </VStack>
            <InputGroup>
              <InputLeftElement>
                <ColorPicker
                  currentColor={inputColor}
                  onSelect={setInputColor}
                />
              </InputLeftElement>
              <Input
                placeholder="Adicionar Tag"
                value={inputName}
                onChange={e => {
                  setInputName(e.target.value)
                }}
              />
              <InputRightElement>
                <IconButton
                  aria-label="adicionar tag"
                  as={BiPlus}
                  size="xs"
                  bg="transparent"
                  color="brand.500"
                  _hover={{}}
                  onClick={handlePostTag}
                />
              </InputRightElement>
            </InputGroup>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => {
              api.patch(REVEAL_APP_BY_ID(app.id), {
                app_tags: selectedTags.map(value => value.id)
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

export default TagSelectorModal

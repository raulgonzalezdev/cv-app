import { Grid, Icon, Tag, TagLabel, useDisclosure } from '@chakra-ui/react'
import { BiPlusCircle } from 'react-icons/bi'

import { DataApp } from '../../interfaces/dataApp'
import TagSelectorModal from './TagSelectorModal'

interface TagSelectorProps {
  app: DataApp
  onSave: () => void
}

const TagSelector: React.FC<TagSelectorProps> = ({ app, onSave }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Grid templateColumns="repeat(3, 1fr)" gap={0.5}>
        {app?.tags?.map(tag => (
          <Tag
            size={'sm'}
            key={tag.id}
            borderRadius="full"
            variant="solid"
            bgColor={tag.color}
          >
            <TagLabel>{tag.name}</TagLabel>
          </Tag>
        ))}
        <Icon
          color={'brand.500'}
          fontSize={'18px'}
          as={BiPlusCircle}
          onClick={onOpen}
        />
      </Grid>
      <TagSelectorModal
        isOpen={isOpen}
        onClose={() => {
          onSave()
          onClose()
        }}
        app={app}
      ></TagSelectorModal>
    </>
  )
}

export default TagSelector

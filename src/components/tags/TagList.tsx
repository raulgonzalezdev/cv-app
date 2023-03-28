import { HStack, Tag, TagLabel } from '@chakra-ui/react'

import AppTag from '../../interfaces/appTag'

interface TagListProps {
  tags: AppTag[]
}

const TagList: React.FC<TagListProps> = ({ tags }) => {
  return (
    <HStack w={'100%'}>
      {tags.map(tag => (
        <HStack key={tag.id} spacing={4}>
          <Tag
            size={'sm'}
            key={tag.id}
            borderRadius="full"
            variant="solid"
            bgColor={tag.color}
          >
            <TagLabel>{tag.name}</TagLabel>
          </Tag>
        </HStack>
      ))}
    </HStack>
  )
}

export default TagList

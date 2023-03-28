import { Box, Text, VStack } from '@chakra-ui/react'
import Link from 'next/link'

import { useAppsByTag } from '../../hooks/useTag'
import AppTag from '../../interfaces/appTag'

interface TagCardProps {
  tag: AppTag
}
const TagCard: React.FC<TagCardProps> = ({ tag }) => {
  const { apps } = useAppsByTag(tag.id)
  return (
    <Link href={`/app/tags/${tag.id}`} passHref>
      <Box
        as="a"
        bg="white"
        padding="5"
        borderRadius="10px"
        shadow="md"
        borderLeftColor={tag.color}
        borderLeftWidth="10px"
      >
        <VStack w="100%">
          <Text w="100%" fontWeight="semibold">
            {tag.name}
          </Text>
          <Text fontSize="small" fontWeight="semibold" color="gray" w="100%">
            {apps?.length} {apps?.length == 1 ? 'Aplicação' : 'Aplicações'}
          </Text>
        </VStack>
      </Box>
    </Link>
  )
}

export default TagCard

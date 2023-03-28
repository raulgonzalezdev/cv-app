import { HStack, Icon, IconButton, Link, Tooltip } from '@chakra-ui/react'
import React from 'react'
import { BiFile, BiX } from 'react-icons/bi'

interface FileViewLinkProps {
  url: string
  onClear: () => void
}

const FileViewLink: React.FC<FileViewLinkProps> = ({ url, onClear }) => {
  const fileName = new URL(url).pathname.split('/').pop()

  return (
    <HStack spacing={1} align="center" w="full">
      <Icon as={BiFile} fontSize="xl" />
      <Tooltip placement="bottom-start" label="Download" hasArrow>
        <Link href={url} target="_blank" flex="1">
          {fileName}
        </Link>
      </Tooltip>
      <IconButton
        aria-label="Excluir arquivo"
        variant="ghost"
        colorScheme="red"
        icon={<Icon as={BiX} fontSize="24px" />}
        onClick={onClear}
      />
    </HStack>
  )
}

export default FileViewLink

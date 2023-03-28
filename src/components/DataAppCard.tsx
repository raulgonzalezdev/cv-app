import {
  Avatar,
  AvatarGroup,
  Box,
  HStack,
  Icon,
  IconButton,
  Spacer,
  Text,
  VStack
} from '@chakra-ui/react'
import Link from 'next/link'
import { BiFile, BiInfoCircle, BiStar } from 'react-icons/bi'

import { REVEAL_APP_BY_ID } from '../constants/api-urls'
import { useApi } from '../hooks/useApi'
// import { useVersionByApp } from '../hooks/useVersion'
import { DataApp } from '../interfaces/dataApp'
import TagList from './tags/TagList'

interface DataAppCardProps {
  app: DataApp
}

const DataAppCard: React.FC<DataAppCardProps> = ({ app }) => {
  const { api } = useApi()
  // const { app_version } = useVersionByApp(app.instance_id, 'last')

  return (
    <Link
      passHref
      href={
        app.published
          ? `/app/project/${app.instance_id}/instance`
          : `/app/project/${app.instance_id}/edit`
      }
    >
      <Box
        as="a"
        bg={'white'}
        padding={'5'}
        borderRadius={'20px'}
        shadow={'md'}
      >
        <VStack h="full">
          <HStack w={'100%'}>
            <Icon as={BiFile} color={'brand.500'} w={10} h={10} />
            <Text fontWeight={'semibold'}>{app.name}</Text>
            {!app.published && <Icon as={BiInfoCircle} color={'yellow.400'} />}
            <Link href="javascript:location.reload();">
              <IconButton
                onClick={() => {
                  api.patch(REVEAL_APP_BY_ID(app.id), {
                    favorite: !app.favorite
                  })
                }}
                aria-label="favorite"
                as={BiStar}
                color={app.favorite == true ? 'yellow.400' : 'gray'}
                backgroundColor="white"
                _hover={{ bgColor: 'white' }}
                w={5}
                h={5}
              />
            </Link>
          </HStack>
          <TagList tags={app.tags} />
          <Spacer />
          <HStack w={'100%'}>
            <Text fontSize={'small'} fontWeight={'semibold'} color={'gray'}>
              3 dias atras
            </Text>
            <Spacer />
            <AvatarGroup size="xs" max={2} spacing={'-1.5'}>
              <Avatar
                src={app.team?.owner.avatar}
                name={app.team?.owner.name}
              />
              {app.team?.members.map(member => (
                <Avatar
                  src={member.avatar}
                  key={member.id}
                  name={member.name}
                />
              ))}
            </AvatarGroup>
          </HStack>
        </VStack>
      </Box>
    </Link>
  )
}

export default DataAppCard

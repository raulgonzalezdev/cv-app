import { Avatar, Heading, HStack, Text, VStack } from '@chakra-ui/react'

const UserInfo = () => {
  const user = { id: 1, name: 'Teste', avatar: '' }
  return (
    <HStack spacing={3} p={3} bg="appBg" borderRadius={9}>
      <Avatar
        size={'sm'}
        name={user?.name}
        src={user?.avatar}
        colorScheme="blue"
      />
      <VStack spacing={1} w="full" align="flex-start">
        <Heading as="h4" size="xs" fontWeight={500} color="gray.800">
          {user?.name}
        </Heading>
      </VStack>
    </HStack>
  )
}

const Header = (titles: string) => {
  return (
    <HStack px={10} bg="gray.100" justify={'space-between'}>
      <Text color={'blue'} fontWeight={'bold'}>
        {titles}
      </Text>
      {/* <InputGroup w={'30%'}>
        <Input borderRadius={'20px'} bg={'white'} borderColor={'purple'} />
        <InputRightElement>
          <Icon as={BiSearch}></Icon>
        </InputRightElement>
      </InputGroup> */}
      <UserInfo></UserInfo>
    </HStack>
  )
}

export default Header

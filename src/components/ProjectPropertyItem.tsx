import { Heading, StackProps, VStack } from '@chakra-ui/react'

type ProjectPropertyItemProps = {
  title: string
} & StackProps

const ProjectPropertyItem: React.FC<ProjectPropertyItemProps> = ({
  title,
  children,
  ...rest
}) => {
  return (
    <VStack w="full" align="flex-start" spacing={3} px={3} {...rest}>
      <Heading as="h3" size="xs" fontWeight="semibold" textColor="gray.600">
        {title}
      </Heading>
      {children}
    </VStack>
  )
}

export default ProjectPropertyItem

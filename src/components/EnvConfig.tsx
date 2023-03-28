import { Grid, Icon, Tag, TagLabel, useDisclosure } from '@chakra-ui/react'
import { BiPlusCircle } from 'react-icons/bi'

import { DataApp } from '../interfaces/dataApp'
import EnvConfigModal from './EnvConfigModal'

interface EnvConfigProps {
  app: DataApp
  onSave: () => void
}

const EnvConfig: React.FC<EnvConfigProps> = ({ app, onSave }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Grid templateColumns="repeat(3, 1fr)" gap={0.5}>
        {app?.envs?.map(env => (
          <Tag size="sm" key={env.key} variant="outline" borderRadius="full">
            <TagLabel textAlign="center" w="100%">
              {env.key}
            </TagLabel>
          </Tag>
        ))}
        <Icon
          color="brand.500"
          fontSize="18px"
          as={BiPlusCircle}
          onClick={onOpen}
        />
      </Grid>
      <EnvConfigModal
        app_id={app.id}
        isOpen={isOpen}
        onClose={() => {
          onSave()
          onClose()
        }}
      ></EnvConfigModal>
    </>
  )
}

export default EnvConfig

import { Tag, TagProps } from '@chakra-ui/react'
import React from 'react'

type StatusTagProps = {
  active: boolean
} & TagProps

const StatusTag: React.FC<StatusTagProps> = ({ active, ...props }) => {
  const statusParam = {
    ativo: {
      color: 'green',
      label: 'Ativo'
    },
    inativo: {
      color: 'red',
      label: 'Inativo'
    }
  }

  const status = active ? 'ativo' : 'inativo'

  return (
    <Tag variant="solid" colorScheme={statusParam[status]?.color} {...props}>
      {statusParam[status]?.label}
    </Tag>
  )
}

export default StatusTag

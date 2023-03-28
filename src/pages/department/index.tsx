import { Heading } from '@chakra-ui/react'
import React from 'react'

import AppLayout from '../../components/AppLayout'
import DepartmentList from '../../components/department/DepatmentList'

const DepartmentPage: React.FC = () => {
  return (
    <AppLayout title="Departamentos">
      <Heading
        as="h2"
        fontSize="2xl"
        fontWeight="semibold"
        textColor="brandDark.800"
        mb={'10px'}
      >
        Departamentos
      </Heading>
      <DepartmentList></DepartmentList>
    </AppLayout>
  )
}

export default DepartmentPage

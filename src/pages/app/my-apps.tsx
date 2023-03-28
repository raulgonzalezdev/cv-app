import { Grid, Heading } from '@chakra-ui/react'
import React from 'react'

import AppLayout from '../../components/AppLayout'
import DataAppCard from '../../components/DataAppCard'
import { useDataApps } from '../../hooks/useDataApp'
import { DataApp } from '../../interfaces/dataApp'

const AppDashboardPage: React.FC = () => {
  const { apps } = useDataApps()
  return (
    <AppLayout title="Minhas Aplicações">
      <Heading
        as="h2"
        fontSize="2xl"
        fontWeight="semibold"
        textColor="brandDark.800"
        mb={'10px'}
      >
        Minhas Aplicações
      </Heading>
      <Grid templateColumns="repeat(4, 1fr)" gap={6}>
        {apps?.map((app: DataApp) => (
          <DataAppCard key={app.id} app={app} />
        ))}
      </Grid>
    </AppLayout>
  )
}

export default AppDashboardPage

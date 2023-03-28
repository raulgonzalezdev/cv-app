import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Grid,
  Heading
} from '@chakra-ui/react'
import React from 'react'

import AppLayout from '../../components/AppLayout'
import DataAppCard from '../../components/DataAppCard'
import TagCard from '../../components/tags/TagCard'
import { usePublishedDataApp } from '../../hooks/useDataApp'
import { useTags } from '../../hooks/useTag'
import AppTag from '../../interfaces/appTag'
import { DataApp } from '../../interfaces/dataApp'

const AppDashboardPage: React.FC = () => {
  const { apps } = usePublishedDataApp()
  const { tags } = useTags()
  return (
    <AppLayout title="Dashboard">
      <Heading
        as="h2"
        fontSize="2xl"
        fontWeight="semibold"
        textColor="brandDark.800"
        mb={'10px'}
      >
        Dashboard
      </Heading>
      <Accordion defaultIndex={[0]} borderBottomWidth="0px" allowMultiple>
        <AccordionItem borderY="0" bg="transparent">
          <AccordionButton borderBottomWidth="1px">
            <Box flex="1" fontWeight="semibold" textAlign="left">
              Tags
            </Box>
            <AccordionIcon />
          </AccordionButton>

          <AccordionPanel borderBottomWidth="0px" pb={4}>
            <Grid templateColumns="repeat(4, 1fr)" gap={6}>
              {tags?.map((tag: AppTag) => (
                <TagCard key={tag.id} tag={tag} />
              ))}
            </Grid>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem borderY="0" bg="transparent">
          <AccordionButton borderBottomWidth="1px">
            <Box flex="1" fontWeight="semibold" textAlign="left">
              Favoritos
            </Box>
            <AccordionIcon />
          </AccordionButton>

          <AccordionPanel borderBottomWidth="0px" pb={4}>
            <Grid templateColumns="repeat(4, 1fr)" gap={6}>
              {apps?.map(
                (app: DataApp) =>
                  app['favorite'] && <DataAppCard key={app.id} app={app} />
              )}
            </Grid>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem borderY="0" bg="transparent">
          <AccordionButton borderBottomWidth="1px">
            <Box flex="1" fontWeight="semibold" textAlign="left">
              Aplicações Compartilhadas
            </Box>
            <AccordionIcon />
          </AccordionButton>

          <AccordionPanel borderBottomWidth="0px" pb={4}>
            <Grid templateColumns="repeat(4, 1fr)" gap={6}>
              {apps?.map((app: DataApp) => (
                <DataAppCard key={app.id} app={app} />
              ))}
            </Grid>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </AppLayout>
  )
}

export default AppDashboardPage

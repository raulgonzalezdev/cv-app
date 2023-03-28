import { Grid, Heading } from '@chakra-ui/react'
import { GetStaticPaths, GetStaticProps } from 'next'
import React from 'react'

import AppLayout from '../../../components/AppLayout'
import DataAppCard from '../../../components/DataAppCard'
import { useAppsByTag, useTag } from '../../../hooks/useTag'
import { DataApp } from '../../../interfaces/dataApp'

export interface TagIdPageProps {
  id: string
}
const TagIdPage: React.FC<TagIdPageProps> = ({ id }) => {
  const { tag } = useTag(id)
  const { apps } = useAppsByTag(id)
  return (
    <AppLayout title={tag?.name}>
      <Heading
        as="h2"
        fontSize="2xl"
        fontWeight="semibold"
        textColor="brandDark.800"
        mb={'10px'}
      >
        {tag?.name}
      </Heading>
      <Grid templateColumns="repeat(4, 1fr)" gap={6}>
        {apps?.map((app: DataApp) => (
          <DataAppCard key={app.id} app={app} />
        ))}
      </Grid>
    </AppLayout>
  )
}

export default TagIdPage

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  return {
    props: params
  }
}

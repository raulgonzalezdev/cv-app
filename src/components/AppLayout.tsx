import { Box, Flex } from '@chakra-ui/react'
import React from 'react'

import SeoInfo, { SeoInfoProps } from './SeoInfo'
import Sidebar from './Sidebar'

type AppLayoutProps = SeoInfoProps & {
  noPadding?: boolean
}

const AppLayout: React.FC<AppLayoutProps> = ({
  title,
  children,
  noPadding
}) => {
  const padding = noPadding ? { p: 0 } : { pl: 8, pt: 7, pr: 6, pb: 7 }

  return (
    <SeoInfo title={title}>
      <Flex as="section" overflowY="hidden" h="100vh" bg="brandDark.50">
        <Sidebar />
        <Box flex="1" ml="2px" {...padding}>
          {children}
        </Box>
      </Flex>
    </SeoInfo>
  )
}

export default AppLayout

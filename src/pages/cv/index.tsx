import { Box, StackDivider, VStack } from '@chakra-ui/react'
import { useColorMode } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'

import CVProfile from '../../components/cv/CVProfile'
// import Header from '../../components/cv/Header'
import SeoInfo from '../../components/SeoInfo'

interface CVPageProps {
  lang: string
  editable: boolean
}
const IndexPage: React.FC<CVPageProps> = ({ lang, editable }) => {
  const [currentLang, setLang] = useState(lang)
  const [currentEditable, setEditable] = useState(editable)
  const { colorMode, toggleColorMode } = useColorMode()
  const editorRef = useRef(null)
  return (
    <>
      <SeoInfo title="CV ">
        <CVProfile
          lang={currentLang}
          editable={currentEditable}
          key={currentLang}
        />
      </SeoInfo>
    </>
  )
}
IndexPage.getInitialProps = async ctx => {
  const lang = ctx.query.lang || 'es'
  const editable = ctx.query.editable ? ctx.query.editable === 'true' : false
  return { lang, editable }
}

export default IndexPage

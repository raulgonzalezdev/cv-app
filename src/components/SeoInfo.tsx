import Head from 'next/head'

import { APP_TITLE } from '../constants/app-info'
import DefaultProps from '../interfaces/default.props'

export type SeoInfoProps = {
  title: string
} & DefaultProps

const SeoInfo: React.FC<SeoInfoProps> = ({ title, children }) => {
  return (
    <>
      <Head>
        <title>
          {title?.concat(' | ')}
          {APP_TITLE}
        </title>
      </Head>
      {children}
    </>
  )
}

export default SeoInfo

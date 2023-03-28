import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import React from 'react'

import PageShellLoading from '../../components/pageShellLoading'
import AddEdit from '../../components/user/AddEdit'
import { IDuseUsers } from '../../hooks/useUsers'

interface UserIdProps {
  id: string
}

const UserId: React.FC<UserIdProps> = props => {
  const { isFallback, isReady } = useRouter()
  const { users, mutate } = IDuseUsers(props.id)

  if (isFallback || !isReady || !users) {
    return <PageShellLoading />
  }

  const onSave = () => {
    return null
  }

  return (
    <>
      <AddEdit onSave={onSave} data={users} mutate={mutate} />
    </>
  )
}

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

export default UserId

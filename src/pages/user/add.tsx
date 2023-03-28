import React from 'react'

import AddEdit from '../../components/user/AddEdit'

const Add: React.FC = () => {
  const onSave = () => {
    return null
  }

  return <AddEdit onSave={onSave} />
}

export default Add

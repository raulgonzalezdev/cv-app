import { Select } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { APP_VERSION_NUMBER } from '../constants/routes'

interface SelectVersionProps {
  versions: number[]
  instance_id: string
  currentVersion?: number
}

const SelectVersion: React.FC<SelectVersionProps> = ({
  versions,
  currentVersion,
  instance_id
}) => {
  const [value, setValue] = useState(currentVersion || versions.at(0))
  const router = useRouter()

  const onChangeValue = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(Number(e.target.value))
    router.push(APP_VERSION_NUMBER(instance_id, e.target.value))
  }

  return (
    <Select size="sm" value={value} onChange={onChangeValue}>
      {versions?.map(v => (
        <option key={v} value={v.toString()}>
          {v}
        </option>
      ))}
    </Select>
  )
}

export default SelectVersion

import { IconType } from 'react-icons'

export interface MenuItem {
  name: string
  icon: IconType
  path: string
  instance_id?: string
  titles?: string
}

import { User } from './user'

export default interface Department {
  id: string
  name: string
  owner: User
  members: User[]
}

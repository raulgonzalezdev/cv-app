import { User } from './user'

export default interface Team {
  id: string
  owner: User
  members: User[]
}

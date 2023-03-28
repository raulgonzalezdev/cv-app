import AppTag from './appTag'
import Department from './department'
import Team from './team'

export interface DataApp {
  id: string
  name: string
  icon: string
  instance_id: string
  team: Team
  departments: Department[]
  published: boolean
  tags: AppTag[]
  envs: { key: string; value: string }[]
  favorite: boolean
}

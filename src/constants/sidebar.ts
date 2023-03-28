import { BiGridAlt, BiGroup, BiHive, BiUser } from 'react-icons/bi'

import {
  APP_DASHBOARD,
  APP_MY_APPS,
  CV,
  DEPARTMENT_LIST,
  USER_LIST
} from './routes'

const ADM = [
  {
    name: 'Dashboard',
    icon: BiGridAlt,
    path: APP_DASHBOARD
  },
  {
    name: 'Minhas aplicações',
    icon: BiHive,
    path: APP_MY_APPS
  },
  {
    name: 'Usuários',
    icon: BiUser,
    path: USER_LIST
  },
  {
    name: 'Resumen Vitae',
    icon: BiGroup,
    path: CV
  }
]

const CUS = [
  {
    name: 'Dashboard',
    icon: BiGridAlt,
    path: APP_DASHBOARD
  }
]

const ENG = [
  {
    name: 'Dashboard',
    icon: BiGridAlt,
    path: APP_DASHBOARD
  },
  {
    name: 'Minhas aplicações',
    icon: BiHive,
    path: APP_MY_APPS
  }
]

export const MAIN_MENU_ITEMS = {
  ADM,
  CUS,
  ENG
}

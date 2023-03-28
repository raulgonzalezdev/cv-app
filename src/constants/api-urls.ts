const apiURL =
  typeof window === 'undefined'
    ? process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL
    : process.env.NEXT_PUBLIC_BASE_URL

const getFinalUrl = (url: string) => {
  return `${apiURL}${url}`
}

const getPropString = (props: { key: string; value: string }[]) => {
  let prop_string = ''
  props?.map((prop, index) => {
    if (index == 0) prop_string += `?${prop.key}=${prop.value}`
    else prop_string += `&${prop.key}=${prop.value}`
  })
  return prop_string
}

//Ruta StreamLit
export const STREAMLIT_SERVER = process.env.STREAMLIT_SERVER

//Auth Routes
export const AUTH_LOGIN = getFinalUrl('auth/login/')
export const AUTH_REGISTER = getFinalUrl('auth/register/')
export const AUTH_REQUEST_PASSWORD_RESET = getFinalUrl('auth/')

//Reveal Routes

////Users
export const REVEAL_USERS_PROPS = (props: { key: string; value: string }[]) =>
  getFinalUrl(`api/reveal/user/${getPropString(props)}`)

export const REVEAL_USERS_ID = (id: string) =>
  getFinalUrl(`api/reveal/user/${id}/`)

////Data apps
export const REVEAL_APPS = getFinalUrl('api/reveal/application/')
export const REVEAL_APPS_PROPS = (props: { key: string; value: string }[]) =>
  getFinalUrl(`api/reveal/application/${getPropString(props)}`)

export const REVEAL_APP_BY_ID = (id: string) =>
  getFinalUrl(`api/reveal/application/${id}/`)

export const REVEAL_PUBLISH_APP = (instance_id: string) =>
  getFinalUrl(`api/reveal/application/publish/?instance_id=${instance_id}`)

export const REVEAL_WRITE_TEST_APP = (instance_id: string) =>
  getFinalUrl(`api/reveal/application/write-test/?instance_id=${instance_id}`)

export const REVEAL_DELETE_APP = (id: string) =>
  getFinalUrl(`api/reveal/application/${id}/delete/`)

////Versions
export const REVEAL_PUBLISHED_VERSIONS = getFinalUrl(
  'api/reveal/version/published-versions/'
)
export const REVEAL_VERSION_BY_ID = (id: string) =>
  getFinalUrl(`api/reveal/version/${id}/`)

export const REVEAL_UPDATE_VERSION_BY_ID = (instance_id: string) =>
  getFinalUrl(`api/reveal/version/update-code/?instance_id=${instance_id}`)

export const REVEAL_LAST_VERSION_BY_APP = (instance_id: string) =>
  getFinalUrl(
    `api/reveal/version/?instance_id=${instance_id}&version_number=last`
  )

export const REVEAL_VERSION_BY_APP = (
  instance_id: string,
  version_number?: string
) =>
  getFinalUrl(
    version_number === 'last'
      ? `api/reveal/version/?instance_id=${instance_id}`
      : `api/reveal/version/?instance_id=${instance_id}&version_number=${version_number}`
  )

////Tags
export const REVEAL_TAGS = getFinalUrl('api/reveal/tag/')
export const REVEAL_TAGS_BY_ID = (id: string) =>
  getFinalUrl(`api/reveal/tag/${id}/`)

export const REVEAL_TAGS_GET_APPS = (id: string) =>
  getFinalUrl(`api/reveal/tag/${id}/get-apps/`)

////Teams
export const REVEAL_TEAM_BY_ID = (id: string) =>
  getFinalUrl(`api/reveal/team/${id}/`)

/// Chatgpt

export const REVEAL_CHATGPT = (prompt: string) => getFinalUrl(`chat/${prompt}/`)

////Departments
export const REVEAL_DEPARTMENTS = getFinalUrl('api/reveal/department/')

export const REVEAL_DEPARTMENTS_BY_ID = (id: string) =>
  getFinalUrl(`api/reveal/department/${id}/`)

//////Env Config
export const REVEAL_ENV_CONFIG = getFinalUrl('api/reveal/env-config/')

export const AVATAR = (id: string) =>
  getFinalUrl(`api/reveal/user/${id}/avatar/`)

export const ME = () => getFinalUrl(`api/reveal/user/me/`)

export const IMAGE = getFinalUrl('auth/imagens/')

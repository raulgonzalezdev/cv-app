import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import Router from 'next/router'

export async function handleRefreshToken(
  error: unknown,
  refreshToken: string
): Promise<AxiosResponse> {
  return new Promise<AxiosResponse>((resolve, reject) => {
    try {
      const header = {
        'Content-Type': 'application/json'
      }
      const parameters = {
        method: 'post',
        headers: header
      } as AxiosRequestConfig

      axios
        .post(
          `${process.env.NEXT_PUBLIC_SERVICE}/refresh`,
          { refreshToken },
          parameters
        )
        .then(async res => {
          return resolve(res)
        })
        .catch(() => {
          Router.push('/login')
          return reject(error)
        })
    } catch (err) {
      return reject(err)
    }
  })
}

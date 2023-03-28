import axios from 'axios'
import http from 'http'
import nookies from 'nookies'
import WebSocket from 'ws'
const wss = new WebSocket.Server({ noServer: true })
import { setupWSConnection } from 'y-websocket/bin/utils'
import { setPersistence } from 'y-websocket/bin/utils'
import * as Y from 'yjs'

import {
  REVEAL_LAST_VERSION_BY_APP,
  REVEAL_UPDATE_VERSION_BY_ID
} from '../../constants/api-urls'

const host = process.env.WS_HOST || 'localhost'
const port = process.env.WS_PORT || 1234

function getApi(req) {
  const api = axios.create({ baseURL: process.env.BASE_URL })
  api.interceptors.request.use(
    request => {
      const { '@reavel.token': token } = nookies.get({ req })

      if (request.headers && token) {
        request.headers.Authorization = `Bearer ${token}`
      }

      return request
    },
    error => {
      return Promise.reject(error)
    }
  )
  return api
}

const SocketHandler = (req, res) => {
  //const { api } = useApi()
  if (res.socket.server.io) {
    console.log('Socket is already running')
    setPersistence({
      bindState: async (id: string, document: Y.Doc) => {
        // initialize the document with persisted content
        console.log('update Binding state', id)
        const api = getApi(req)
        const { data } = await api.get(REVEAL_LAST_VERSION_BY_APP(id))
        console.log(data)
        if (data?.code) {
          document.getText('codemirror').insert(0, data.code)
          const state = Y.encodeStateAsUpdate(document)
          Y.applyUpdate(document, state)
        } else {
          console.log('Document not found', id)
        }
      },
      writeState: async (id: string, document: Y.Doc) => {
        // store the Yjs document to your database
        // this is called when all clients disconnect
        console.log('update writing state', id)
        const code = document.getText('codemirror').toString()
        console.log(code)
        const api = getApi(req)
        await api.put(REVEAL_UPDATE_VERSION_BY_ID(id), {
          code: code
        })
      }
    })
  } else {
    console.log('Socket is initializing')
    const server = http.createServer((request, response) => {
      response.writeHead(200, { 'Content-Type': 'text/plain' })
      response.end('okay')
    })
    setPersistence({
      bindState: async (id: string, document: Y.Doc) => {
        // initialize the document with persisted content
        console.log('Binding state', id)
        const api = getApi(req)
        const { data } = await api.get(REVEAL_LAST_VERSION_BY_APP(id))

        if (data?.code) {
          Y.applyUpdate(document, data.code)
        } else {
          console.log('Document not found', id)
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      writeState: async (id: string, document: Y.Doc) => {
        // store the Yjs document to your database
        // this is called when all clients disconnect
        console.log('writing state', id)

        //api.put(REVEAL_UPDATE_VERSION_BY_ID(id), code)
      }
    })

    wss.on('connection', setupWSConnection)

    server.on('upgrade', (request, socket, head) => {
      // You may check auth of request here..
      // See https://github.com/websockets/ws#client-authentication
      const handleAuth = ws => {
        wss.emit('connection', ws, request)
      }
      wss.handleUpgrade(request, socket, head, handleAuth)
    })

    server.listen(port, () => {
      console.log(`running at '${host}' on port ${port}`)
    })

    res.socket.server.io = server
  }
  res.end()
}

export default SocketHandler

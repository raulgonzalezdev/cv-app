import CodeMirror from 'codemirror'
import { useRouter } from 'next/router'
import { version } from 'os'
import { useEffect, useRef } from 'react'
import { CodemirrorBinding } from 'y-codemirror'
import { WebsocketProvider } from 'y-websocket'
import * as Y from 'yjs'
require('codemirror/mode/python/python')

import {
  REVEAL_UPDATE_VERSION_BY_ID,
  REVEAL_WRITE_TEST_APP
} from '../constants/api-urls'
import { useApi } from '../hooks/useApi'
import { useAuth } from '../hooks/useAuth'

const host = process.env.NEXT_PUBLIC_WS_HOST || 'localhost'
const port = process.env.NEXT_PUBLIC_WS_PORT || 1234

const CodeEditor: React.FC<{
  instance_id: string
  version_number?: string
  onPublish: boolean
  openTest: boolean
  isReadOnly?: boolean
}> = ({
  instance_id,
  version_number,
  onPublish,
  openTest,
  isReadOnly = false
}) => {
  const { isReady } = useRouter()
  const { api } = useApi()
  const { user } = useAuth()

  const provider = useRef<WebsocketProvider | null>(null)
  const ydoc = useRef<Y.Doc | null>(null)
  const editor = useRef<CodeMirror.Editor | null>(null)

  const socketInitializer = async () => {
    await fetch('/api/socket')
  }
  const writeTest = async () => {
    const code = ydoc?.current?.getText('codemirror').toString()
    await api.put(REVEAL_UPDATE_VERSION_BY_ID(instance_id), {
      code: code
    })
    await api.post(REVEAL_WRITE_TEST_APP(instance_id), { code: code })
  }

  // console.log('criou a pagina')

  useEffect(() => {
    if (editor.current) {
      if (openTest) editor.current.setSize('100%', '93vh')
      else editor.current.setSize('100%', '93vh')
    }
  }, [openTest])

  useEffect(() => {
    if (!isReady) return
    if (onPublish) {
      console.log('publicado')
      if (provider.current) {
        console.log('closing provider', provider)
        provider.current.destroy() //We destroy doc we created and disconnect
        ydoc.current?.destroy()
      }
      return
    }
    try {
      if (!editor.current) {
        editor.current = CodeMirror(document.getElementById('editor'), {
          mode: 'python',
          lineNumbers: true,
          readOnly: isReadOnly
        })
        // console.log('modes', CodeMirror.mimeModes)
        editor.current.setSize('100%', '93vh')
      }
      socketInitializer()
      // console.log('creating provider', provider)

      ydoc.current = new Y.Doc()
      ydoc.current.on('update', () => {
        if (openTest) {
          // console.log('update')
          writeTest()
        }
      })

      provider.current = new WebsocketProvider(
        `ws://${host}:${port}`,
        instance_id,
        ydoc.current
      )
      provider.current.on('status', event => {
        console.log(event.status) // logs "connected" or "disconnected"
      })

      const yText = ydoc.current.getText('codemirror')

      //const yUndoManager = new Y.UndoManager(yText)

      const awareness = provider.current.awareness //awareness is what makes other user aware about your actions

      // console.log(user)
      awareness.setLocalStateField('user', {
        name: user?.name,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16)
      })

      new CodemirrorBinding(yText, editor.current, awareness)
    } catch (err) {
      alert('error in collaborating try refreshing or come back later !')
    }

    return () => {
      if (provider.current) {
        // console.log('closing provider', provider)
        provider.current.destroy() //We destroy doc we created and disconnect
        ydoc.current?.destroy()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, onPublish, openTest])

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        fontSize: '14px',
        overflowY: 'auto'
      }}
    >
      {<div id="editor"></div>}
    </div>
  )
}

export default CodeEditor

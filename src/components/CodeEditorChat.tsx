import 'codemirror/mode/python/python'

import CodeMirror from 'codemirror'
import React, { useEffect, useRef } from 'react'

interface Props {
  text: string
}

const CodeEditor: React.FC<Props> = ({ text }) => {
  const editorRef = useRef<HTMLDivElement>(null)
  //const editorRef = useRef<CodeMirror.Editor | null>(null)
  const content = text || ''

  useEffect(() => {
    if (!editorRef.current) return

    const editor = CodeMirror(editorRef.current, {
      value: content,
      mode: 'python',
      lineNumbers: true,
      readOnly: false
    })

    editor.setSize('100%', '100%')

    editor.addKeyMap({
      'Ctrl-Space': function (cm) {
        const cursor = cm.getCursor()
        const line = cm.getLine(cursor.line)
        const lineBeforeCursor = line.substring(0, cursor.ch)

        if (lineBeforeCursor === 'for ') {
          cm.replaceSelection('for i in range(10):\n  \n')
          cm.setCursor({ line: cursor.line + 1, ch: 2 })
        }
      }
    })

    return () => editor.refresh()
  }, [content])

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
    >
      <div ref={editorRef} />
    </div>
  )
}

export default CodeEditor

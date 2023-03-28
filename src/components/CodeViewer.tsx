import React, { useEffect, useRef } from 'react'
import { UnControlled as CodeMirror } from 'react-codemirror2'
require('codemirror/mode/python/python')

const CodeFormat: React.FC<{
  code: string
}> = ({ code }) => {
  const codemirrorRef = useRef<any>()

  useEffect(() => {
    if (codemirrorRef) {
      codemirrorRef.current.editor.display.wrapper.style.height = '93vh'
      codemirrorRef.current.editor.display.wrapper.style.fontSize = '14px'
    }
  })
  console.log(code)
  return (
    <CodeMirror
      ref={codemirrorRef}
      value={code}
      options={{
        mode: 'python',
        lineNumbers: true,
        readOnly: true
      }}
    />
  )
}

export default CodeFormat

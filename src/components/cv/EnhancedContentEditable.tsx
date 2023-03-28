import { Box } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import React, { useEffect, useRef, useState } from 'react'

import { useEditorContext } from '../../pages/EditorContext'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

const EnhancedContentEditable = ({ html, onChange, editable, ...props }) => {
  const { activeEditor, setActiveEditor } = useEditorContext()
  const [value, setValue] = useState(html)
  const editorId = useRef(Math.random().toString(36).substring(2, 11))
  const quillRef = useRef(null)

  const handleChange = newValue => {
    setValue(newValue)
    onChange({ target: { value: newValue } })
  }

  const ReadOnlyContent = () => {
    return (
      <Box
        dangerouslySetInnerHTML={{ __html: value }}
        style={{ minHeight: '1rem' }}
        onClick={() => {
          if (editable) setActiveEditor(editorId.current)
        }}
        {...props}
      />
    )
  }

  const handleBlur = e => {
    if (editable) {
      setTimeout(() => {
        if (
          quillRef.current &&
          typeof quillRef.current.getEditor === 'function'
        ) {
          const quillEditor = quillRef.current.getEditor()
          const quillContainer = quillEditor?.container

          if (
            quillContainer &&
            !quillContainer.contains(e.relatedTarget) &&
            !quillContainer.contains(document.activeElement)
          ) {
            setActiveEditor(null)
          }
        }
      }, 200)
    }
  }

  useEffect(() => {
    if (activeEditor !== editorId.current && activeEditor !== null) {
      setActiveEditor(null)
    }
  }, [])

  return activeEditor === editorId.current ? (
    <ReactQuill
      ref={quillRef}
      value={value}
      onChange={handleChange}
      onBlur={e => handleBlur(e)}
      modules={{
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'], // toggled buttons
          ['blockquote', 'code-block'],

          [{ header: 1 }, { header: 2 }], // custom button values
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
          [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
          [{ direction: 'rtl' }], // text direction

          [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
          [{ header: [1, 2, 3, 4, 5, 6, false] }],

          [{ color: [] }, { background: [] }], // dropdown with defaults
          [{ font: [] }],
          [{ align: [] }],

          ['clean'], // remove formatting button

          ['link', 'image', 'video'] // link and image, video
        ]
      }}
      {...props}
    />
  ) : (
    <ReadOnlyContent />
  )
}

export default EnhancedContentEditable

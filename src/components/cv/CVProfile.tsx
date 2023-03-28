import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  useMediaQuery,
  VStack
} from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'

import AppLayout from '../../components/AppLayout'
import { data } from './data'
import EnhancedContentEditable from './EnhancedContentEditable'
import GeneratePDF from './GeneratePDF'
import Header from './Header'

const CVProfile = ({ lang, editable }) => {
  const datapersona = data
  const [isLargerThan800] = useMediaQuery('(min-width: 800px)')
  const bgColor = useColorModeValue('white', 'gray.700')
  const textColor = useColorModeValue('gray.700', 'gray.50')
  const [currentLang, setLang] = useState(lang)
  const [currentEditable, setEditable] = useState(editable)
  const { colorMode, toggleColorMode } = useColorMode()
  const [editableData, setEditableData] = useState(datapersona)
  const [saved, setSaved] = useState(false)

  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete
  } = useDisclosure()

  const editorRef = useRef(null)

  const setNestedProperty = (obj, path, value) => {
    if (!obj) {
      return
    }

    if (path.length === 1) {
      obj[path[0]] = value
    } else {
      const [head, ...tail] = path
      if (!obj[head]) {
        obj[head] = {}
      }
      setNestedProperty(obj[head], tail, value)
    }
  }

  const handleContentChange = (e, lang, field) => {
    setEditableData(prevData => {
      const newData = { ...prevData }

      setNestedProperty(newData, [lang, ...field.split('.')], e.target.value)

      return newData
    })
  }

  useEffect(() => {
    const savedData = localStorage.getItem('cvData')
    if (savedData) {
      console.log('Cargando datos desde localStorage')
      setEditableData(JSON.parse(savedData))
    } else {
      console.log('Cargando datos desde la fuente fija')
      setEditableData(datapersona)
    }
  }, [])

  useEffect(() => {
    const savedData = localStorage.getItem('cvData')
    if (savedData) {
      const parsedSavedData = JSON.parse(savedData)
      if (parsedSavedData[lang]) {
        console.log('Cargando datos del lenguaje desde localStorage')
        setEditableData(parsedSavedData)
      } else {
        console.log('Cargando datos del lenguaje desde la fuente fija')
        setEditableData(datapersona)
      }
    } else {
      console.log('Cargando datos del lenguaje desde la fuente fija')
      setEditableData(datapersona)
    }
  }, [lang])

  useEffect(() => {
    if (saved) {
      localStorage.removeItem('cvData')

      localStorage.setItem('cvData', JSON.stringify(editableData))
      console.log('Gurdando datos en localStorage')
      setSaved(false)
    }
  }, [saved, editableData])

  const content = editableData[lang]

  const saveData = () => {
    try {
      localStorage.removeItem('cvData')

      localStorage.setItem('cvData', JSON.stringify(editableData))
      setSaved(true)
      onOpenDelete()
    } catch (error) {
      console.error('Error al guardar datos:', error)
      alert(
        'Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.'
      )
    }
  }

  const renderSectionContent = (section, fieldPath) =>
    section.map((item, index) => (
      <EnhancedContentEditable
        key={index}
        onSave={saveData}
        //ref={editorRef}
        html={item}
        editable={editable}
        onChange={e => handleContentChange(e, lang, `${fieldPath}.${index}`)}
        // className="contentEditable-pre-wrap"
      />
    ))

  const sections = [
    {
      id: 0,
      title: 'Certificaciones',
      content: content.certificates,
      fieldPath: 'certificates'
    },
    {
      id: 1,
      title: 'Aptitudes principales',
      content: content.mainSkills,
      fieldPath: 'mainSkills'
    },
    {
      id: 2,
      title: 'Intereses',
      content: content.interests,
      fieldPath: 'interests'
    }
  ]

  const renderSections = () =>
    sections.map(section => (
      <Box
        key={section.id}
        boxShadow="md"
        p="6"
        rounded="md"
        bg={bgColor}
        color={textColor}
        w="100%"
      >
        <Text fontWeight="bold">{section.title}:</Text>
        <Box key={section.id} as="ul" listStyleType="disc" pl={4}>
          {renderSectionContent(section.content, section.fieldPath)}
        </Box>
      </Box>
    ))

  const [saveButtonPosition, setSaveButtonPosition] = useState({
    top: 120,
    bottom: '4%',
    right: '4%'
  })

  // Para guardar el CV en la base de datos:
  const saveCV = async cvData => {
    const response = await fetch('/api/cv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cvData)
    })

    if (!response.ok) {
      throw new Error('Error al guardar el CV')
    }

    return await response.json()
  }

  // Para recuperar el CV de la base de datos:
  const fetchCV = async id => {
    const response = await fetch(`/api/cv?id=${id}`)

    if (!response.ok) {
      throw new Error('Error al recuperar el CV')
    }

    return await response.json()
  }

  return (
    <AppLayout title="Resumen">
      <Header
        lang={currentLang}
        setLang={setLang}
        toggleColorMode={toggleColorMode}
        setEditable={setEditable}
        editable={currentEditable}
      />

      <Box
        w="100%"
        overflowY="auto"
        maxHeight="calc(100vh - 130px)"
        boxShadow="md"
        p="2"
        rounded="md"
        bg={bgColor}
        color={textColor}
      >
        <Grid
          templateColumns={{
            base: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)'
          }}
          gap={2}
          w="100%"
          boxShadow="md"
          p="2"
          rounded="md"
          bg={bgColor}
          color={textColor}
        >
          <Box
            boxShadow="md"
            p="6"
            rounded="md"
            bg={bgColor}
            w="100%"
            color={textColor}
          >
            <EnhancedContentEditable
              onSave={saveData}
              ref={editorRef}
              editable={editable}
              html={content.personalInfo.name}
              onChange={e => handleContentChange(e, lang, `personalInfo.name`)}
            />

            <EnhancedContentEditable
              onSave={saveData}
              ref={editorRef}
              editable={editable}
              html={content.personalInfo.title}
              onChange={e => handleContentChange(e, lang, `personalInfo.title`)}
            />
            <EnhancedContentEditable
              onSave={saveData}
              ref={editorRef}
              editable={editable}
              html={content.personalInfo.country}
              // className="contentEditable-lg"
              onChange={e =>
                handleContentChange(e, lang, `personalInfo.country`)
              }
            />

            <Text>
              Contactar:
              <EnhancedContentEditable
                onSave={saveData}
                ref={editorRef}
                editable={editable}
                html={content.personalInfo.contact}
                // className="contentEditable-lg"
                onChange={e =>
                  handleContentChange(e, lang, `personalInfo.contact`)
                }
              />
            </Text>
            <Text>
              LinkedIn:
              <EnhancedContentEditable
                onSave={saveData}
                ref={editorRef}
                editable={editable}
                html={content.personalInfo.linkedin}
                // className="contentEditable-lg"
                onChange={e =>
                  handleContentChange(e, lang, `personalInfo.linkedin`)
                }
              />
            </Text>
          </Box>

          <Box
            boxShadow="md"
            p="2"
            rounded="md"
            bg={bgColor}
            color={textColor}
            w="100%"
          >
            <Text fontWeight="bold">Extracto</Text>
            <EnhancedContentEditable
              html={content.extract}
              editable={editable}
              onSave={saveData}
              onChange={e => handleContentChange(e, lang, 'extract')}
              ref={editorRef}
            />
          </Box>
        </Grid>

        <Box
          boxShadow="md"
          p="2"
          rounded="md"
          bg={bgColor}
          color={textColor}
          w="100%"
        >
          <Text fontWeight="bold">Experiencia:</Text>
        </Box>

        <Grid
          templateColumns={{
            base: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)'
          }}
          gap={2}
          w="100%"
          boxShadow="md"
          p="2"
          rounded="md"
          bg={bgColor}
          color={textColor}
        >
          {content.experience.map((exp, index) => (
            <Box
              boxShadow="md"
              p="6"
              rounded="md"
              bg={bgColor}
              color={textColor}
              w="100%"
              key={index}
            >
              <EnhancedContentEditable
                html={exp.company}
                index={index}
                editable={editable}
                onSave={saveData}
                onChange={e =>
                  handleContentChange(e, lang, `experience.${index}.company`)
                }
                ref={editorRef}
              />
              <EnhancedContentEditable
                html={exp.position}
                index={index}
                editable={editable}
                onSave={saveData}
                onChange={e =>
                  handleContentChange(e, lang, `experience.${index}.position`)
                }
                ref={editorRef}
              />
              <EnhancedContentEditable
                html={exp.period}
                index={index}
                editable={editable}
                onSave={saveData}
                onChange={e =>
                  handleContentChange(e, lang, `experience.${index}.period`)
                }
                ref={editorRef}
              />
              <EnhancedContentEditable
                html={exp.location}
                index={index}
                editable={editable}
                onSave={saveData}
                onChange={e =>
                  handleContentChange(e, lang, `experience.${index}.location`)
                }
                ref={editorRef}
              />
              <EnhancedContentEditable
                html={exp.description}
                index={index}
                editable={editable}
                onSave={saveData}
                onChange={e =>
                  handleContentChange(
                    e,
                    lang,
                    `experience.${index}.description`
                  )
                }
                // className="contentEditable-pre-wrap"
                ref={editorRef}
              />

              <Text fontWeight="bold">Proyectos:</Text>
              <Box as="ul" listStyleType="disc" pl={4}>
                {exp.projects.map((project, projIndex) => (
                  <li key={projIndex}>
                    <EnhancedContentEditable
                      html={project.name}
                      index={projIndex}
                      editable={editable}
                      onSave={saveData}
                      onChange={e =>
                        handleContentChange(
                          e,
                          lang,
                          `experience.${index}.projects.${projIndex}.name`
                        )
                      }
                      ref={editorRef}
                    />

                    <EnhancedContentEditable
                      html={project.description}
                      index={projIndex}
                      editable={editable}
                      onSave={saveData}
                      onChange={e =>
                        handleContentChange(
                          e,
                          lang,
                          `experience.${index}.projects.${projIndex}.description`
                        )
                      }
                      ref={editorRef}
                    />
                  </li>
                ))}
              </Box>
            </Box>
          ))}
        </Grid>

        <Grid
          templateColumns={{
            base: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)'
          }}
          gap={2}
          w="100%"
          boxShadow="md"
          p="2"
          rounded="md"
          bg={bgColor}
          color={textColor}
        >
          {renderSections()}
          <Box
            boxShadow="md"
            p="2"
            rounded="md"
            bg={bgColor}
            w="100%"
            color={textColor}
          >
            <Text fontWeight="bold">Educacion:</Text>
            {content.education?.map((educa, index) => (
              <>
                <EnhancedContentEditable
                  html={educa.institution}
                  index={index}
                  editable={editable}
                  onSave={saveData}
                  onChange={e =>
                    handleContentChange(
                      e,
                      lang,
                      `education.${index}.institution`
                    )
                  }
                  ref={editorRef}
                />
                <EnhancedContentEditable
                  html={educa.degree}
                  index={index}
                  editable={editable}
                  onSave={saveData}
                  onChange={e =>
                    handleContentChange(e, lang, `education.${index}.degree`)
                  }
                  ref={editorRef}
                />
                <EnhancedContentEditable
                  html={educa.period}
                  index={index}
                  editable={editable}
                  onSave={saveData}
                  onChange={e =>
                    handleContentChange(e, lang, `education.${index}.period`)
                  }
                  ref={editorRef}
                />
              </>
            ))}
          </Box>

          {editable && (
            <div
              style={{
                position: 'fixed',
                ...saveButtonPosition,
                maxWidth: isLargerThan800 ? 'none' : '200px'
              }}
            >
              <Button
                onClick={() => {
                  saveData()
                  setSaved(true)
                }}
              >
                Guardar
              </Button>
            </div>
          )}
        </Grid>
        {isOpenDelete && (
          <GeneratePDF
            isOpen={isOpenDelete}
            lang={lang}
            onClose={onCloseDelete}
            data={editableData}
          />
        )}
      </Box>
    </AppLayout>
  )
}

export default CVProfile

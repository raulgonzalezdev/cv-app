import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button
} from '@chakra-ui/react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import React, { useState } from 'react'

type GeneraAlertProps = {
  data: any
  lang: string
  isOpen: boolean
  onClose: () => void
}

const GeneratePDF: React.FC<GeneraAlertProps> = ({
  data,
  lang,
  isOpen,
  onClose
}) => {
  const cancelRef = React.useRef()
  // Función para eliminar los elementos HTML de una cadena
  function removeHtmlTags(text) {
    if (text === undefined) {
      return ''
    }
    return text.replace(/<[^>]+>|&nbsp;|\u00FE|\u00FF/g, '')
  }

  // Estado para manejar la apertura y cierre del diálogo modal

  function generate() {
    const doc = new jsPDF()

    // Información personal
    autoTable(doc, {
      body: [
        [
          {
            content: removeHtmlTags(data[lang].personalInfo.name),
            colSpan: 2,
            styles: { halign: 'center' }
          }
        ],
        [
          {
            content: removeHtmlTags(data[lang].personalInfo.title),
            colSpan: 2,
            styles: { halign: 'center' }
          }
        ],
        ['Country', removeHtmlTags(data[lang].personalInfo.country)],
        ['Contact', removeHtmlTags(data[lang].personalInfo.contact)],
        ['LinkedIn', removeHtmlTags(data[lang].personalInfo.linkedin)]
      ],
      margin: { top: 20 }
    })

    // Extracto
    autoTable(doc, {
      head: [['Extracto']],
      body: [[removeHtmlTags(data[lang].extract)]],
      margin: { top: 20 }
    })

    // Habilidades principales
    autoTable(doc, {
      head: [['Habilidades principales']],
      body: data[lang].mainSkills.map(skill => [removeHtmlTags(skill)]),
      margin: { top: 20 }
    })
    // Experiencia laboral
    autoTable(doc, {
      head: [['Empresa', 'Posición', 'Periodo', 'Ubicación', 'Descripción']],
      body: data[lang].experience.map(exp => [
        removeHtmlTags(exp.company),
        removeHtmlTags(exp.position),
        removeHtmlTags(exp.period),
        removeHtmlTags(exp.location),
        removeHtmlTags(exp.description)
      ]),
      margin: { top: 20 }
    })

    // Proyectos de experiencia laboral
    data[lang].experience.forEach(exp => {
      autoTable(doc, {
        head: [[`Proyectos (${removeHtmlTags(exp.company)})`, 'Descripcion']],
        body: exp.projects.map(proj => [
          removeHtmlTags(proj.name),
          removeHtmlTags(proj.description)
        ]),
        margin: { top: 20 }
      })
    })

    // Educación
    autoTable(doc, {
      head: [['Institución', 'Grado', 'Periodo']],
      body: data[lang].education.map(edu => [
        removeHtmlTags(edu.institution),
        removeHtmlTags(edu.degree),
        removeHtmlTags(edu.period)
      ]),
      margin: { top: 20 }
    })

    // Intereses
    autoTable(doc, {
      head: [['Intereses']],
      body: data[lang].interests.map(interest => [removeHtmlTags(interest)]),
      margin: { top: 20 }
    })

    // Certificaciones
    autoTable(doc, {
      head: [['Certificaciones']],
      body: data[lang].certificates.map(certification => [
        removeHtmlTags(certification)
      ]),
      margin: { top: 20 }
    })

    doc.save('cv.pdf')
    onClose()
  }

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Descargar PDF</AlertDialogHeader>
            <AlertDialogBody>¿Desea descargar el PDF?</AlertDialogBody>
            <AlertDialogFooter>
              <Button colorScheme="red" onClick={onClose}>
                No
              </Button>
              <Button colorScheme="green" ml={3} onClick={generate}>
                Sí
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default GeneratePDF

import { HStack, Icon, Text } from '@chakra-ui/react'
import { format } from 'date-fns'
import React from 'react'
import { BiCalendar } from 'react-icons/bi'

interface DateFormatProps {
  start: Date

  hasIcon?: boolean
  format?: string
}

const DateFormat: React.FC<DateFormatProps> = props => {
  const transformDate = value => {
    let date = value
    try {
      if (typeof value === 'string') {
        date = new Date(value)
      }
    } catch (error) {
      date = new Date()
    }
    return date
  }

  return (
    <HStack spacing={1} align="center" color="gray.600">
      {props.hasIcon && <Icon as={BiCalendar} fontSize="xl" />}
      <Text fontSize={12}>
        {props.start &&
          format(transformDate(props.start), props.format || 'MMM dd')}{' '}
      </Text>
    </HStack>
  )
}

export default DateFormat

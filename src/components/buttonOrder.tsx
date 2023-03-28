import {
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { BiCheck, BiSortAlt2 } from 'react-icons/bi'

interface ButtonOrderProps {
  items: Record<string, string>
  type?: 'callback' | 'url'
  onClick?: (key: string) => void
}

const ButtonOrder: React.FC<ButtonOrderProps> = ({ items, onClick }) => {
  const router = useRouter()
  const { order, ...restQuery } = router.query
  const [selected, setSelected] = React.useState<string>('')

  useEffect(() => {
    setSelected(order?.toString() || '')
  }, [order])

  const onSelect = (key: string) => {
    setSelected(key)
    onClick && onClick(key)
    updateUrl(key)
  }

  const updateUrl = (key: string) => {
    const qs = Object.keys(restQuery)
      .map(key => `${key}=${restQuery[key]}`)
      .join('&')

    router.push(`${router.pathname}?order=${key}&${qs}`)
  }

  return (
    <Menu id="order" isLazy>
      <MenuButton
        as={Button}
        leftIcon={<Icon as={BiSortAlt2} fontSize="lg" />}
        variant="ghost"
        fontWeight={400}
        size="sm"
        _hover={{ bg: 'purple.50', color: 'purple.500' }}
      >
        Ordenar{selected ? `: ${items[selected]}` : ''}
      </MenuButton>
      <MenuList>
        {Object.keys(items).map(key => (
          <MenuItem key={key} fontSize="sm" onClick={() => onSelect(key)}>
            <Flex flex={1} justify="space-between" align="center">
              <Text>{items[key]}</Text>
              {selected === key && <Icon as={BiCheck} fontSize="md" />}
            </Flex>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}

export default ButtonOrder

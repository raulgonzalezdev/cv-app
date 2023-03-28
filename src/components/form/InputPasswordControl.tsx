import {
  Icon,
  IconButton,
  IconProps,
  Input,
  InputGroup,
  InputLeftElement,
  InputProps,
  InputRightElement
} from '@chakra-ui/react'
import { useField } from 'formik'
import { BaseProps, FormControl } from 'formik-chakra-ui'
import React, { FC, ForwardedRef, useState } from 'react'
import { IconType } from 'react-icons'
import { BiHide, BiShow } from 'react-icons/bi'

export type InputPasswordControlProps = BaseProps & {
  inputProps?: InputProps
  icon?: IconType
  iconProps?: IconProps
}

export const InputPasswordControl: FC<InputPasswordControlProps> =
  React.forwardRef(
    (props: InputPasswordControlProps, ref: ForwardedRef<HTMLInputElement>) => {
      const { name, label, icon, iconProps, inputProps, ...rest } = props
      const [field, { error, touched }] = useField(name)

      const isInvalid = !!error && touched ? { color: 'red.500' } : {}

      const [show, setShow] = useState(false)

      return (
        <FormControl name={name} label={label} {...rest}>
          <InputGroup>
            {icon && (
              <InputLeftElement pointerEvents="none">
                <Icon
                  as={icon}
                  color="brand.500"
                  fontSize={20}
                  {...iconProps}
                  {...isInvalid}
                />
              </InputLeftElement>
            )}

            <Input
              type={show ? 'text' : 'password'}
              {...field}
              id={name}
              {...inputProps}
              ref={ref}
            />

            <InputRightElement>
              <IconButton
                aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
                isRound
                size="sm"
                variant="ghost"
                icon={<Icon as={show ? BiShow : BiHide} fontSize={16} />}
                onClick={() => setShow(!show)}
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>
      )
    }
  )

InputPasswordControl.displayName = 'InputPasswordControl'

export default InputPasswordControl

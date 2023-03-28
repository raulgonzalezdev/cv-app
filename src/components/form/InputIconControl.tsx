import {
  Icon,
  IconProps,
  Input,
  InputGroup,
  InputLeftElement,
  InputProps
} from '@chakra-ui/react'
import { useField } from 'formik'
import { BaseProps, FormControl } from 'formik-chakra-ui'
import React, { FC, ForwardedRef } from 'react'
import { IconType } from 'react-icons'

export type InputIconControlProps = BaseProps & {
  inputProps?: InputProps
  icon: IconType
  iconProps?: IconProps
}

export const InputIconControl: FC<InputIconControlProps> = React.forwardRef(
  (props: InputIconControlProps, ref: ForwardedRef<HTMLInputElement>) => {
    const { name, label, icon, iconProps, inputProps, ...rest } = props
    const [field, { error, touched }] = useField(name)

    const isInvalid = !!error && touched ? { color: 'red.500' } : {}

    return (
      <FormControl name={name} label={label} {...rest}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon
              as={icon}
              color="brand.500"
              fontSize={20}
              {...iconProps}
              {...isInvalid}
            />
          </InputLeftElement>

          <Input {...field} id={name} {...inputProps} ref={ref} />
        </InputGroup>
      </FormControl>
    )
  }
)

InputIconControl.displayName = 'InputIconControl'

export default InputIconControl

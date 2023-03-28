import { ToastProps, useToast as useChakraToast } from '@chakra-ui/react'

function useToast(props?: ToastProps) {
  const myProps: ToastProps = {
    size: 'xs',
    fontSize: '4px',
    isClosable: true,
    position: 'bottom'
  }
  const toast = useChakraToast({ ...myProps, ...props })
  return toast
}

export default useToast

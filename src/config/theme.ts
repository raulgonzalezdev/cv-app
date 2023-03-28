import { extendTheme, withDefaultColorScheme } from '@chakra-ui/react'

export const theme = extendTheme(
  {
    fonts: {
      heading:
        'Metropoliss, "Helvetica Neue", -apple-system, BlinkMacSystemFont, "Roboto", sans-serif',
      body: 'Metropoliss, "Helvetica Neue", -apple-system, BlinkMacSystemFont, "Roboto", sans-serif'
    },
    colors: {
      brand: {
        50: 'hsl(216, 100%, 98%)',
        100: 'hsl(216, 100%, 86%)',
        200: 'hsl(216, 100%, 77%)',
        300: 'hsl(216, 100%, 68%)',
        400: 'hsl(216, 100%, 64%)',
        500: 'hsl(216, 100%, 59%)',
        600: 'hsl(216, 100%, 41%)',
        700: 'hsl(216, 100%, 32%)',
        800: 'hsl(216, 100%, 23%)',
        900: 'hsl(216, 100%, 12%)'
      },
      brandDark: {
        50: 'hsl(216, 30%, 98%)',
        100: 'hsl(216, 30%, 90%)',
        200: 'hsl(216, 30%, 77%)',
        300: 'hsl(216, 30%, 68%)',
        400: 'hsl(216, 30%, 50%)',
        500: 'hsl(216, 30%, 59%)',
        600: 'hsl(216, 30%, 41%)',
        700: 'hsl(216, 30%, 32%)',
        800: 'hsl(216, 30%, 23%)',
        900: 'hsl(216, 30%, 12%)'
      }
    }
  },
  withDefaultColorScheme({ colorScheme: 'brand' })
)

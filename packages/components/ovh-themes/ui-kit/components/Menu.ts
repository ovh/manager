// eslint-disable-next-line prettier/prettier
import type { ComponentStyleConfig } from '@chakra-ui/theme';
import { menuAnatomy as parts } from "@chakra-ui/anatomy"

const Menu: ComponentStyleConfig = {
  parts: parts.keys, // button, item, list, groupTitle, command, divider
  baseStyle: {
    list: {
      backgroundColor: '#fff',
      border: '0 solid rgba(0,14,156,.075)',
      borderRadius: 'medium',
      boxShadow: 'primary',
      margin: 0,
      marginTop: '-0.625rem',
      maxWidth: '18.75rem',
      minWidth: '8.75rem',
      padding: 0,
      textAlign: 'initial',
    },
    groupTitle: {
      color: 'uikit.800-text',
      fontSize: '.875rem',
      fontWeight: '700',
      lineHeight: '1rem',
      margin: 0,
      padding: '.5rem 1rem',
    },
    item: {
      backgroundColor: 'transparent',
      color: 'uikit.500',
      display: 'block',
      fontWeight: '600',
      lineHeight: '1rem',
      padding: '.5rem 1rem',
      textAlign: 'left',
      width: '100%',
      _focus: {
        backgroundColor: 'uikit.100',
      },
      _active: {
        backgroundColor: 'uikit.100',
        _disabled: {
          backgroundColor: 'inherit',
        },
      },
      _disabled: {
        opacity: .5,
      },
    },
    divider: {
      borderColor: 'gray.300',
      margin: '0 1rem',
    },
  },
  variants: {
    compact: {
      button: {
        borderRadius: '50%',
        height: '1.5rem',
        width: '1.5rem',
      },
    },
  },
  defaultProps: {
    colorScheme: 'uikit',
    variant: 'uikit',
  },
};

export default Menu;

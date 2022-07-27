<<<<<<< HEAD
// eslint-disable-next-line prettier/prettier
import type { ComponentMultiStyleConfig } from '@chakra-ui/theme';
import { menuAnatomy as parts } from '@chakra-ui/anatomy';

const Menu: ComponentMultiStyleConfig = {
  parts: parts.keys, // button, item, list, groupTitle, command, divider
  baseStyle: {
    list: {
      backgroundColor: '#fff',
      border: '0 solid rgba(0,14,156,.075)',
      borderRadius: 'medium',
      boxShadow: 'primary',
      margin: 0,
      maxWidth: '18.75rem',
      minWidth: '8.75rem',
      padding: 0,
      textAlign: 'initial',
    },
    groupTitle: {
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
=======

// eslint-disable-next-line prettier/prettier
import type { ComponentStyleConfig } from '@chakra-ui/theme';
import { menuAnatomy as parts } from "@chakra-ui/anatomy"

const Menu: ComponentStyleConfig = {
  parts: parts.keys, // button, item, list, groupTitle, command, divider
  baseStyle: {
    button: {
      borderRadius: '50%',
    },
    list: {
      minWidth: '8.75rem',
      maxWidth: '18.75rem',
      margin: 0,
      padding: 0,
      listStyle: 'none',
      textAlign: 'initial',
      boxShadow: '0 0 6px 0 rgba(0,14,156,.2)',
      border: '0 solid rgba(0,14,156,.075)',
      borderRadius: '6px',
      backgroundColor: '#fff',
      marginTop: '-0.625rem',
    },
    groupTitle: {
      lineHeight: '1rem',
      display: 'block',
      margin: 0,
      padding: '.5rem 1rem',
      fontSize: '.875rem',
      fontWeight: '700',
      color: 'uikit.800-text',
      backgroundColor: 'transparent',
    },
    item: {
      width: '100%',
      lineHeight: '1rem',
      display: 'block',
      padding: '.5rem 1rem',
      textAlign: 'left',
      fontSize: '1rem',
      fontWeight: '600',
      color: 'uikit.500',
      border: 'none',
      backgroundColor: 'transparent',
>>>>>>> feat(chakra): add action menu component
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
<<<<<<< HEAD
=======
      flexDirection: 'row-reverse',

>>>>>>> feat(chakra): add action menu component
    },
    divider: {
      borderColor: 'gray.300',
      margin: '0 1rem',
    },
  },
  variants: {
    compact: {
<<<<<<< HEAD
      button: {
        borderRadius: '50%',
        height: '1.5rem',
        width: '1.5rem',
=======
      list: {
        marginTop: 0,
        _before: {
          content:'""',
          borderStyle: 'solid',
          borderWidth: '0 .625rem .625rem .625rem',
          borderColor: 'transparent transparent rgba(0,14,156,.075) transparent',
          position: 'absolute',
          left: '0px',
          margin: '0 .5rem',
          top: '-0.625rem',
        },
        _after: {
          content:'""',
          borderStyle: 'solid',
          borderWidth: '0 calc(.625rem - 2px) calc(.625rem - 2px) calc(.625rem - 2px)',
          borderColor: 'transparent transparent #fff transparent',
          position: 'absolute',
          left: '2px',
          margin: '0 .5rem',
          top: '-0.625rem',
        },
>>>>>>> feat(chakra): add action menu component
      },
    },
  },
  defaultProps: {
<<<<<<< HEAD
    colorScheme: 'uikit',
    variant: 'uikit',
=======
    variant: 'uikit',
    colorScheme: 'uikit',
>>>>>>> feat(chakra): add action menu component
  },
};

export default Menu;

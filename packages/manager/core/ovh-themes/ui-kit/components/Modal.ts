// eslint-disable-next-line prettier/prettier
import type { ComponentStyleConfig } from '@chakra-ui/theme';

import { modalAnatomy as parts } from '@chakra-ui/anatomy';

const Modal: ComponentStyleConfig = {
  parts: parts.keys, // overlay, dialogContainer, dialog, header, closeButton, body, footer
  baseStyle: {
    dialog: {
      borderRadius: 'large',
      boxShadow: 'secondary',
    },
    header: {
      background: 'gray.100',
      borderTopLeftRadius: 'large',
      borderTopRightRadius: 'large',
      flex: 'auto',
      height: '2rem',
    },
    closeButton: {
      color: 'uikit.500',
      cursor: 'pointer',
      width: '1.5rem',
      height: '1.5rem',
      top: '.25rem',
      right: '.5rem',
      _hover: {
        background: 'none',
      },
    },
    body: {
      padding: '1.5rem 2rem',
    },
    footer: {
      padding: '0 2rem 1.5rem',
    }
  },
  sizes: {
    fill: {
      dialog: {
        maxWidth: 'fit-content',
      }
    },
  },
  variants: {
    info: {
      header: {
        background: 'uikit.100',
      },
    },
    help: {
      header: {
        background: 'uikit.100',
      },
    },
    success: {
      header: {
        background: 'success.300',
      },
    },
    warning: {
      header: {
        background: 'warning.300',
      },
    },
    error: {
      header: {
        background: 'error.300',
      },
    },
  },
  defaultProps: {
    colorScheme: 'uikit',
    size: 'fill',
  },
};

export default Modal;

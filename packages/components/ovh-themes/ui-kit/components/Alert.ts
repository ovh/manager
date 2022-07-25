
// eslint-disable-next-line prettier/prettier
import type { ComponentStyleConfig } from '@chakra-ui/theme';
import { alertAnatomy as parts } from "@chakra-ui/anatomy"

const computeContainerColors = (props: any) => {
  const { status } = props;
  switch (status) {
    case 'success': {
      return {
        container: {
          background: 'success.300',
          color: 'success.500',
        }
      };
    }
    case 'warning': {
      return {
        container: {
          background: 'warning.300',
          color: 'warning.500',
        }
      };
    }
    case 'error': {
      return {
        container: {
          background: 'error.300',
          color: 'error.500',
        }
      };
    }
    case 'info':
    default:
      return {
        container: {
          background: 'uikit.100',
          color: 'uikit.800-text',
        }
      };
  }
}

const Alert: ComponentStyleConfig = {
  parts: parts.keys, // container, icon, title, description, spinner
  baseStyle: {
    container: {
      borderRadius: '0.5rem',
      fontSize: '16px',
      fontWeight: 400,
      margin: '0 0 1rem',
      padding: '1rem 1.5rem',
    },
    icon: {
      lineHeight: 1,
      display: 'block',
      fontSize: '16px',
      marginLeft: '-0.5rem',
      width: '1.5rem',
      height: '1.5rem',
    },
  },
  variants: {
    uikit: computeContainerColors,
  },
  defaultProps: {
    variant: 'uikit',
    colorScheme: 'uikit',
  },
};

export default Alert;

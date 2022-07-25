<<<<<<< HEAD
// eslint-disable-next-line prettier/prettier
import { alertAnatomy as parts } from "@chakra-ui/anatomy"
import type { ComponentStyleConfig } from '@chakra-ui/theme';

const computeContainerStyle = (props: any) => {
  const { status } = props;

  let containerStyle;
  switch (status) {
    case 'success': {
      containerStyle = {
        background: 'success.300',
        color: 'success.500',
      };
      break;
    }
    case 'warning': {
      containerStyle = {
        background: 'warning.300',
        color: 'warning.500',
      };
      break;
    }
    case 'error': {
      containerStyle = {
        background: 'error.300',
        color: 'error.500',
      };
      break;
    }
    case 'info':
    default:
      containerStyle = {
        background: 'uikit.100',
        color: 'uikit.800-text',
      };
  }
  return { container: containerStyle };
=======

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
>>>>>>> feat(chakra): add Alert component style
}

const Alert: ComponentStyleConfig = {
  parts: parts.keys, // container, icon, title, description, spinner
  baseStyle: {
    container: {
      borderRadius: '0.5rem',
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
      fontSize: '16px',
      margin: '0 0 1rem',
      padding: '1rem 1.5rem',
    },
    icon: {
      height: '1.5rem',
      marginLeft: '-0.5rem',
      width: '1.5rem',
    },
  },
  variants: {
    uikit: computeContainerStyle,
  },
  defaultProps: {
    colorScheme: 'uikit',
    variant: 'uikit',
=======
      fontSize: '1.5rem',
=======
      fontSize: '16px',
>>>>>>> feat(chakra): fixed Alert component style
=======
      fontSize: '1rem',
>>>>>>> feat(chakra): add Table component style
      fontWeight: 400,
      margin: '0 0 1rem',
      padding: '1rem 1.5rem',
    },
    icon: {
      lineHeight: 1,
      display: 'block',
      fontSize: '1rem',
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
>>>>>>> feat(chakra): add Alert component style
  },
};

export default Alert;

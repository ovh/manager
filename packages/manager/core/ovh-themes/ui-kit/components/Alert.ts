// eslint-disable-next-line prettier/prettier
import { alertAnatomy as parts } from "@chakra-ui/anatomy"
import { ComponentStyleConfig } from '@chakra-ui/theme';

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
};

const Alert: ComponentStyleConfig = {
  parts: parts.keys, // container, icon, title, description, spinner
  baseStyle: {
    container: {
      borderRadius: '0.5rem',
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
  },
};

export default Alert;

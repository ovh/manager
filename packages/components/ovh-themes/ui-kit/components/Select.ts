import { ComponentMultiStyleConfig } from '@chakra-ui/theme';
import { selectAnatomy as parts } from '@chakra-ui/anatomy';

import {
  defaultVariantFieldStyles,
  inputFieldStyles,
  successVariantFieldStyles,
  warningVariantFieldStyles,
} from './Input';

const iconBaseStyle = (isInvalid: boolean) => {
  return {
    color: isInvalid ? 'error.500' : 'uikit.500',
    fontSize: '2xl',
    margin: 0,
    minWidth: '2rem',
    padding: 0,
    right: '0.5',
  };
};

const Select: ComponentMultiStyleConfig = {
  parts: parts.keys,
  baseStyle: (props) => {
    return {
      ...inputFieldStyles,
      icon: {
        ...iconBaseStyle(props.isInvalid),
      },
    };
  },
  variants: {
    default: {
      ...defaultVariantFieldStyles,
    },
    warning: {
      ...warningVariantFieldStyles,
      icon: {
        color: 'warning.500',
      },
    },
    success: {
      ...successVariantFieldStyles,
      icon: {
        color: 'success.500',
      },
    },
  },
  sizes: {
    md: {
      field: {
        height: 'initial',
      },
    },
  },
  defaultProps: {
    variant: 'default',
  },
};

export default Select;

import { ComponentMultiStyleConfig } from '@chakra-ui/theme';
import { selectAnatomy as parts } from '@chakra-ui/anatomy';

import {
  inputFieldStyles,
  defaultVariantFieldStyles,
  warningVariantFieldStyles,
  successVariantFieldStyles,
} from './Input';

const iconBaseStyle = (isInvalid: boolean) => {
  return {
    minWidth: '2rem',
    height: '2rem',
    margin: 0,
    padding: 0,
    fontSize: '2xl',
    color: isInvalid ? 'error.500' : 'uikit.500',
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
  defaultProps: {
    variant: 'default',
  },
};

export default Select;

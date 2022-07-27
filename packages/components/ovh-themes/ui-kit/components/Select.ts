import { ComponentMultiStyleConfig } from '@chakra-ui/theme';
import { selectAnatomy as parts } from '@chakra-ui/anatomy';

import {
  inputFieldStyles,
  defaultVariantFieldStyles,
  warningVariantFieldStyles,
  successVariantFieldStyles,
} from './Input';

const Select: ComponentMultiStyleConfig = {
  parts: parts.keys,
  baseStyle: {
    ...inputFieldStyles,
    icon: {
      minWidth: '2rem',
      height: '2rem',
      margin: 0,
      padding: 0,
      fontSize: '2xl',
      color: 'uikit.500',
      right: '0.5',
    },
  },
  variants: {
    default: {
      ...defaultVariantFieldStyles,
    },
    warning: {
      ...warningVariantFieldStyles,
    },
    success: {
      ...successVariantFieldStyles,
    },
  },
  defaultProps: {
    variant: 'default',
  },
};

export default Select;

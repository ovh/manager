import { ComponentStyleConfig } from '@chakra-ui/theme';

import {
  inputFieldStyles,
  defaultVariantFieldStyles,
  warningVariantFieldStyles,
  successVariantFieldStyles,
} from './Input';

const Textarea: ComponentStyleConfig = {
  baseStyle: {
    ...inputFieldStyles.field,
  },
  variants: {
    default: { ...defaultVariantFieldStyles.field },
    warning: { ...warningVariantFieldStyles.field },
    success: { ...successVariantFieldStyles.field },
  },
  defaultProps: {
    variant: 'default',
  },
};

export default Textarea;

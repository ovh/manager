// eslint-disable-next-line prettier/prettier
import type { ComponentMultiStyleConfig } from '@chakra-ui/theme';
import { formErrorAnatomy as parts } from '@chakra-ui/anatomy';

const FormError: ComponentMultiStyleConfig = {
  parts: parts.keys,
  baseStyle: {
    text: {
      color: 'error.500',
      fontWeight: '500',
      fontSize: 'xs',
      margin: '.25rem 0',
      lineHeight: '1rem',
      letterSpacing: '0.008rem',
    },
  },
};

export default FormError;

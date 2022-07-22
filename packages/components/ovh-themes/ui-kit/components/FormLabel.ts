// eslint-disable-next-line prettier/prettier
import type { ComponentStyleConfig } from '@chakra-ui/theme';

const FormInput: ComponentStyleConfig = {
  baseStyle: {
    fontSize: 'xs',
    fontWeight: '800',
    lineHeight: '1rem',
    color: 'uikit.800-text',
    margin: 0,
    _invalid: {
      color: 'error.500',
    },
  },
}

export default FormInput;

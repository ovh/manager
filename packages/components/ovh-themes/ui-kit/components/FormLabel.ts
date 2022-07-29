// eslint-disable-next-line prettier/prettier
import type { ComponentStyleConfig } from '@chakra-ui/theme';

const FormInput: ComponentStyleConfig = {
  baseStyle: {
    fontSize: 'xs',
    fontWeight: '700',
    lineHeight: '1.5',
    margin: 0,
    _invalid: {
      color: 'error.500',
    },
  },
}

export default FormInput;

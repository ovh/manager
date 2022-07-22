// eslint-disable-next-line prettier/prettier
import type { ComponentStyleConfig } from '@chakra-ui/theme';

const FormInput: ComponentStyleConfig = {
  baseStyle: {
    fontSize: 'xs',
<<<<<<< HEAD
    fontWeight: '700',
    lineHeight: '1.5',
=======
    fontWeight: '800',
    lineHeight: '1rem',
    color: 'uikit.800-text',
>>>>>>> feat(chakra): add form control inputs styles
    margin: 0,
    _invalid: {
      color: 'error.500',
    },
  },
}

export default FormInput;

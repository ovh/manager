// eslint-disable-next-line prettier/prettier
import type { ComponentMultiStyleConfig } from '@chakra-ui/theme';
<<<<<<< HEAD
import { formErrorAnatomy as parts } from '@chakra-ui/anatomy';

const FormError: ComponentMultiStyleConfig = {
  parts: parts.keys,
  baseStyle: {
    text: {
      color: 'error.500',
      fontSize: 'xs',
      fontWeight: '500',
      letterSpacing: '0.008rem',
      lineHeight: '1rem',
      margin: '.25rem 0',
=======
import { formErrorAnatomy as parts } from "@chakra-ui/anatomy";

const FormErrorMessage: ComponentMultiStyleConfig = {
  parts: parts.keys,
  baseStyle: {
    text: {
      color: 'uikit.500',
      fontWeight: 500,
      fontSize: 'xs',
>>>>>>> feat(chakra): add form control inputs styles
    },
  },
};

<<<<<<< HEAD
export default FormError;
=======
export default FormErrorMessage;
>>>>>>> feat(chakra): add form control inputs styles

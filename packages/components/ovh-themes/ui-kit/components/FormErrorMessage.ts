// eslint-disable-next-line prettier/prettier
import type { ComponentMultiStyleConfig } from '@chakra-ui/theme';
<<<<<<< HEAD
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
=======
import { formErrorAnatomy as parts } from '@chakra-ui/anatomy';
>>>>>>> feat(tabs): add tabs to chakra theme

const FormError: ComponentMultiStyleConfig = {
  parts: parts.keys,
  baseStyle: {
    text: {
      color: 'error.500',
      fontWeight: '500',
      fontSize: 'xs',
<<<<<<< HEAD
>>>>>>> feat(chakra): add form control inputs styles
=======
      margin: '.25rem 0',
      lineHeight: '1rem',
      letterSpacing: '0.008rem',
>>>>>>> feat(tabs): add tabs to chakra theme
    },
  },
};

<<<<<<< HEAD
<<<<<<< HEAD
export default FormError;
=======
export default FormErrorMessage;
>>>>>>> feat(chakra): add form control inputs styles
=======
export default FormError;
>>>>>>> feat(tabs): add tabs to chakra theme

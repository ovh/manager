// eslint-disable-next-line prettier/prettier
<<<<<<< HEAD
import { formAnatomy as parts } from "@chakra-ui/anatomy"
import type { ComponentMultiStyleConfig } from '@chakra-ui/theme';
=======
import type { ComponentMultiStyleConfig } from '@chakra-ui/theme';
import { formAnatomy as parts } from "@chakra-ui/anatomy"
>>>>>>> feat(chakra): add form control inputs styles


const Form: ComponentMultiStyleConfig = {
  parts: parts.keys,
  baseStyle: {
    helperText: {
      color: 'uikit.700',
<<<<<<< HEAD
      fontSize: 'xs',
      fontWeight: 500,
      lineHeight: '1rem',
=======
      lineHeight: '1rem',
      fontSize: 'xs',
      fontWeight: 500,
>>>>>>> feat(chakra): add form control inputs styles
      margin: '.25rem 0',
    }
  }
}

export default Form;

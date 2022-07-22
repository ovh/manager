// eslint-disable-next-line prettier/prettier
import type { ComponentMultiStyleConfig } from '@chakra-ui/theme';
import { formAnatomy as parts } from "@chakra-ui/anatomy"


const Form: ComponentMultiStyleConfig = {
  parts: parts.keys,
  baseStyle: {
    helperText: {
      color: 'uikit.700',
      lineHeight: '1rem',
      fontSize: 'xs',
      fontWeight: 500,
      margin: '.25rem 0',
    }
  }
}

export default Form;

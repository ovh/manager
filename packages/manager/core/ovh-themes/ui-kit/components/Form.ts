// eslint-disable-next-line prettier/prettier
import { formAnatomy as parts } from "@chakra-ui/anatomy"
import type { ComponentMultiStyleConfig } from '@chakra-ui/theme';


const Form: ComponentMultiStyleConfig = {
  parts: parts.keys,
  baseStyle: {
    helperText: {
      color: 'uikit.700',
      fontSize: 'xs',
      fontWeight: 500,
      lineHeight: '1rem',
      margin: '.25rem 0',
    }
  }
}

export default Form;

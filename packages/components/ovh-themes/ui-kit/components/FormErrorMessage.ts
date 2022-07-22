// eslint-disable-next-line prettier/prettier
import type { ComponentMultiStyleConfig } from '@chakra-ui/theme';
import { formErrorAnatomy as parts } from "@chakra-ui/anatomy";

const FormErrorMessage: ComponentMultiStyleConfig = {
  parts: parts.keys,
  baseStyle: {
    text: {
      color: 'uikit.500',
      fontWeight: 500,
      fontSize: 'xs',
    },
  },
};

export default FormErrorMessage;

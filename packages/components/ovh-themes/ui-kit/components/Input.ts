// eslint-disable-next-line prettier/prettier
import type { ComponentMultiStyleConfig } from '@chakra-ui/theme';

const invalidInputStyle = {
  background: 'error.100',
  borderColor: 'error.300',
  borderRadius: '2px 2px 0 0',
  borderBottomColor: 'error.500',
  boxShadow: 'none',
  px: '0.25rem',
  '::placeholder': {
    color: 'uikit.800-text',
  },
};

const Input: ComponentMultiStyleConfig = {
  parts: ['field', 'addon'],
  baseStyle: {
    field: {
      borderWidth: '1px',
      boxShadow: 'none',
      color: 'uikit.800-text',
      borderRadius: '2px 2px 0 0',
      fontWeight: 600,
    },
  },
  variants: {
    flushed: {
      field: {
        _invalid: {
          ...invalidInputStyle,
          _focus: {
            ...invalidInputStyle,
          },
        },
      },
    },
  },
};

export default Input;

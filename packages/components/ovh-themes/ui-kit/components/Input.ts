// eslint-disable-next-line prettier/prettier
import { inputAnatomy as parts } from "@chakra-ui/anatomy"
import type { ComponentMultiStyleConfig } from '@chakra-ui/theme';
import type { SystemStyleObject } from '@chakra-ui/theme-tools';

// The properties couldn't be put in the baseStyles
// They seem to be overidden by the variants and not merged
const commonInputStyles: SystemStyleObject = {
  boxShadow: 'none',
  borderRadius: 'small small 0 0',
  lineHeight: 1.25,
  minHeight: '2rem',
  padding: '.313rem .25rem',
};

const baseInputStyles: SystemStyleObject = {
  ...commonInputStyles,
  borderColor: 'uikit.100',
};

const stateInputStyle = (
  state: 'error' | 'warning' | 'success',
): SystemStyleObject => {
  return {
    ...commonInputStyles,
    background: `${state}.100`,
    borderColor: `${state}.300`,
    borderBottomColor: `${state}.500`,
  };
};

const invalidInputStyle: SystemStyleObject = {
  _invalid: {
    ...stateInputStyle('error'),
    _focus: {
      ...stateInputStyle('error'),
    },
    _hover: {
      ...stateInputStyle('error'),
    },
  },
};

const readOnlyStyle: SystemStyleObject = {
  background: 'gray.50',
  borderColor: 'transparent transparent uikit.500 transparent',
  cursor: 'not-allowed',
};

export const inputFieldStyles = {
  field: {
    borderWidth: '1px',
    color: 'uikit.800-text',
    fontWeight: 400,
    _placeholder: {
      color: 'uikit.800-text',
      fontWeight: 500,
    },
    _disabled: {
      cursor: 'not-allowed',
      opacity: 0.5,
      _hover: {
        ...baseInputStyles,
        background: 'white',
      },
    },
    _readOnly: {
      ...readOnlyStyle,
      _hover: {
        ...readOnlyStyle,
      },
      _focus: {
        ...readOnlyStyle,
      },
    },
    ...invalidInputStyle,
  },
};

export const defaultVariantFieldStyles = {
  field: {
    ...baseInputStyles,
    _hover: {
      background: 'uikit.100',
      borderBottomColor: 'uikit.500',
    },
    _focus: {
      ...baseInputStyles,
      borderBottomColor: 'uikit.500',
      background: 'uikit.50',
    },
  },
};

export const warningVariantFieldStyles = {
  field: {
    ...baseInputStyles,
    ...stateInputStyle('warning'),
    _focus: {
      ...stateInputStyle('warning'),
    },
  },
};

export const successVariantFieldStyles = {
  field: {
    ...baseInputStyles,
    ...stateInputStyle('success'),
    _focus: {
      ...stateInputStyle('success'),
    },
  },
};

const Input: ComponentMultiStyleConfig = {
  parts: parts.keys,
  baseStyle: {
    ...inputFieldStyles,
  },
  variants: {
    default: {
      ...defaultVariantFieldStyles,
    },
    warning: {
      ...warningVariantFieldStyles,
    },
    success: {
      ...successVariantFieldStyles,
    },
  },
  sizes: {
    md: {
      field: {
        height: 'initial',
      },
    },
  },
  defaultProps: {
    size: 'md',
    variant: 'default',
  },
};

export default Input;

// eslint-disable-next-line prettier/prettier
import type { ComponentMultiStyleConfig } from '@chakra-ui/theme';
import type { Anatomy, PartsStyleObject, SystemStyleObject } from '@chakra-ui/theme-tools';

import { inputAnatomy as parts } from '@chakra-ui/anatomy';

// The properties couldn't be put in the baseStyles
// They seem to be overidden by the variants and not merged
const commonInputStyles: SystemStyleObject = {
  boxShadow: 'none',
  borderRadius: 'small small 0 0',
  lineHeight: 1.25,
  minHeight: '2rem',
  paddingTop: '.313rem',
  paddingBottom: '.313rem',
  paddingLeft: '.25rem',
  height: '2rem',
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
  borderColor: 'gray.50',
  borderBottomColor: 'uikit.500',
  cursor: 'not-allowed',
};

export const inputFieldStyles: PartsStyleObject<typeof parts> = {
  field: {
    borderWidth: '1px',
    fontWeight: 400,
    _placeholder: {
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

export const defaultVariantFieldStyles: PartsStyleObject<typeof parts> = {
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

export const warningVariantFieldStyles: PartsStyleObject<typeof parts> = {
  field: {
    ...baseInputStyles,
    ...stateInputStyle('warning'),
    _focus: {
      ...stateInputStyle('warning'),
    },
  },
};

export const successVariantFieldStyles: PartsStyleObject<typeof parts> = {
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
  defaultProps: {
    variant: 'default',
  },
};

export default Input;

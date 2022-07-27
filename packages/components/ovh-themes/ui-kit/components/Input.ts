// eslint-disable-next-line prettier/prettier
import type { ComponentMultiStyleConfig } from '@chakra-ui/theme';
<<<<<<< HEAD
<<<<<<< HEAD
import type { SystemStyleObject } from '@chakra-ui/theme-tools';

import { inputAnatomy as parts } from '@chakra-ui/anatomy';

// The properties couldn't be put in the baseStyles
// They seem to be overidden by the variants and not merged
const commonInputStyles: SystemStyleObject = {
  boxShadow: 'none',
  borderRadius: 'small small 0 0',
  lineHeight: 1.25,
  minHeight: '2rem',
  padding: '.313rem .25rem',
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

export const inputFieldStyles = {
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
=======
=======
import type { SystemStyleObject } from '@chakra-ui/theme-tools';
>>>>>>> feat(chakra): add form control inputs styles

// The properties couldn't be put in the baseStyles
// They seem to be overidden by the variants and not merged
const commonInputStyles: SystemStyleObject = {
  px: '0.25rem',
<<<<<<< HEAD
  '::placeholder': {
    color: 'uikit.800-text',
>>>>>>> feat: separate tags and badges
=======
  py: '0.25rem',
  boxShadow: 'none',
  borderRadius: '2px 2px 0 0',
  lineHeight: 1.25,
  height: '2.2rem',
};

const baseInputStyles: SystemStyleObject = {
  ...commonInputStyles,
  borderColor: 'uikit.100',
};

const stateInputStyle = (
  state: 'error' | 'warning' | 'success',
): SystemStyleObject => {
  return {
    background: `${state}.100`,
    borderColor: `${state}.300`,
    borderBottomColor: `${state}.500`,
    ...commonInputStyles,
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
>>>>>>> feat(chakra): add form control inputs styles
  },
};

const readOnlyStyle: SystemStyleObject = {
  background: 'gray.50',
  borderColor: 'transparent',
  borderBottomColor: 'uikit.500',
};

<<<<<<< HEAD
const Input: ComponentMultiStyleConfig = {
<<<<<<< HEAD
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
=======
  parts: ['field', 'addon'],
  baseStyle: {
    field: {
      borderWidth: '1px',
=======
export const inputFieldStyles = {
  field: {
    borderWidth: '1px',
    color: 'uikit.800-text',
    fontWeight: 600,
    _placeholder: {
>>>>>>> feat(theme): add select theme to chakra
      color: 'uikit.800-text',
    },
    _disabled: {
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
  parts: ['field', 'addon'],
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
>>>>>>> feat: separate tags and badges
};

export default Input;

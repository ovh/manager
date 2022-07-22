// eslint-disable-next-line prettier/prettier
import type { ComponentMultiStyleConfig } from '@chakra-ui/theme';
import type { SystemStyleObject } from '@chakra-ui/theme-tools';

// The properties couldn't be put in the baseStyles
// They seem to be overidden by the variants and not merged
const commonInputStyles: SystemStyleObject = {
  px: '0.25rem',
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
  },
};

const Input: ComponentMultiStyleConfig = {
  parts: ['field', 'addon'],
  baseStyle: {
    field: {
      borderWidth: '1px',
      color: 'uikit.800-text',
      fontWeight: 600,
      _placeholder: {
        color: 'uikit.800-text',
      },
      ...invalidInputStyle,
    },
  },
  variants: {
    default: {
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
    },
    warning: {
      field: {
        ...baseInputStyles,
        ...stateInputStyle('warning'),
        _focus: {
          ...stateInputStyle('warning'),
        },
      },
    },
    success: {
      field: {
        ...baseInputStyles,
        ...stateInputStyle('success'),
        _focus: {
          ...stateInputStyle('success'),
        },
      },
    },
  },
  defaultProps: {
    variant: 'default',
  },
};

export default Input;

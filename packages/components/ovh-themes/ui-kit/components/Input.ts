// eslint-disable-next-line prettier/prettier
import type { ComponentMultiStyleConfig } from '@chakra-ui/theme';
import type { SystemStyleObject } from '@chakra-ui/theme-tools';

// The properties couldn't be put in the baseStyles
// They seem to be overidden by the variants and not merged
const commonInputStyles: SystemStyleObject = {
  //px: '0.25rem',
  //py: '0.25rem',
  boxShadow: 'none',
  borderRadius: 'small small 0 0',
  lineHeight: 1.25,
  padding: '.313rem .25rem',
  //height: '2.2rem',
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

const readOnlyStyle: SystemStyleObject = {
  background: 'gray.50',
  borderBottomColor: 'uikit.500',
  borderColor: 'transparent',
};

export const inputFieldStyles = {
  field: {
    borderWidth: '1px',
    color: 'uikit.800-text',
    fontWeight: 600,
    _placeholder: {
      color: 'uikit.800-text',
      fontWeight: 500,
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

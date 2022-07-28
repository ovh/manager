// eslint-disable-next-line prettier/prettier
import { checkboxAnatomy as parts } from '@chakra-ui/anatomy';
import type { ComponentMultiStyleConfig } from '@chakra-ui/theme';
import type { SystemStyleObject } from "@chakra-ui/theme-tools";

const controlBaseStyle: SystemStyleObject = {
  borderColor: 'uikit.500',
  boxSizing: 'border-box',
  fontSize: 'md',
  margin: 0,
  _focusVisible: {
    outline: '2px dashed green',
    outlineOffset: '2px',
  },
  _invalid: {
    borderColor: 'error.500',
    _checked: {
      background: 'error.500',
    },
    _hover: {
      borderColor: 'error.500',
    }
  },
  _disabled: {
    background: 'white',
    borderColor: 'uikit.500',
    _checked: {
      background: 'uikit.500',
      borderColor: 'uikit.500',
      color: 'white',
    },
    _invalid: {
      borderColor: 'error.500',
      color: 'white',
      _checked: {
        background: 'error.500',
      },
    },
  },
  _focus: {
    boxShadow: 'secondary',
  },
};

const containerBaseStyle: SystemStyleObject = {
  fontWeight: 700,
  _disabled: {
    opacity: '0.5',
  },
};

const labelBaseStyle: SystemStyleObject = {
  color: 'uikit.800-text',
  fontWeight: 500,
  fontSize: 'md',
  letterSpacing: '.008rem',
  lineHeight: 1.5,
  _checked: {
    fontWeight: 700,
  },
  _disabled: {
    color: 'uikit.800-text',
  },
};

const Checkbox: ComponentMultiStyleConfig = {
  parts: parts.keys,
  baseStyle: {
    container: containerBaseStyle,
    control: controlBaseStyle,
    icon: {
      transition: 'none',
    },
    label: labelBaseStyle,
  },
  sizes: {
    md: {
      icon: {
        height: 'calc(1rem - 2px)',
        width: 'calc(1rem - 2px)',
      },
    },
  },
  defaultProps: {
    colorScheme: 'uikit',
    size: 'md',
  },
};

export default Checkbox;

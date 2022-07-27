// eslint-disable-next-line prettier/prettier
import type { SystemStyleObject } from "@chakra-ui/theme-tools";
import type { ComponentMultiStyleConfig } from '@chakra-ui/theme';
import { checkboxAnatomy as parts } from '@chakra-ui/anatomy';

const controlBaseStyle: SystemStyleObject = {
  fontSize: 'md',
  margin: 0,
  borderColor: 'uikit.500',
  boxSizing: 'border-box',
  _focusVisible: {
    outline: '2px dashed green',
    outlineOffset: '2px',
  },
  _invalid: {
    borderColor: 'error.500',
    _checked: {
      background: 'error.500',
    },
  },
  _disabled: {
    borderColor: 'uikit.500',
    background: 'white',
    _checked: {
      borderColor: 'uikit.500',
      background: 'uikit.500',
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
  _checked: {
    fontWeight: 700,
  },
  _disabled: {
    color: 'uikit.800-text',
  },
  lineHeight: 1.5,
  fontWeight: 500,
  fontSize: 'md',
  color: 'uikit.800-text',
  letterSpacing: '.008rem',
};

const Checkbox: ComponentMultiStyleConfig = {
  parts: parts.keys,
  baseStyle: {
    container: containerBaseStyle,
    control: controlBaseStyle,
    label: labelBaseStyle,
  },
  defaultProps: {
    colorScheme: 'uikit',
  },
};

export default Checkbox;

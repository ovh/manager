// eslint-disable-next-line prettier/prettier
import { checkboxAnatomy as parts } from '@chakra-ui/anatomy';
import { ComponentMultiStyleConfig } from '@chakra-ui/theme';
import { SystemStyleObject } from '@chakra-ui/system';

export const controlBaseStyle: SystemStyleObject = {
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
    background: 'uikit.0',
    _checked: {
      background: 'error.500',
    },
    _hover: {
      borderColor: 'error.500',
    },
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

export const iconBaseStyle: SystemStyleObject = {
  width: 'calc(1rem - 2px)',
  height: 'calc(1rem - 2px)',
  transitionProperty: 'unset',
  transitionDuration: 'unset',
};

export const labelBaseStyle: SystemStyleObject = {
  fontWeight: 500,
  fontSize: 'md',
  letterSpacing: '.008rem',
  lineHeight: 1.5,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  _checked: {
    fontWeight: 700,
  },
};

const Checkbox: ComponentMultiStyleConfig = {
  parts: parts.keys,
  baseStyle: {
    container: containerBaseStyle,
    control: controlBaseStyle,
    icon: iconBaseStyle,
    label: labelBaseStyle,
  },
  defaultProps: {
    colorScheme: 'uikit',
  },
};

export default Checkbox;

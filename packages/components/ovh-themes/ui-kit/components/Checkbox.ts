// eslint-disable-next-line prettier/prettier
<<<<<<< HEAD
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
  fontWeight: 500,
  fontSize: 'md',
  letterSpacing: '.008rem',
  lineHeight: 1.5,
  _checked: {
    fontWeight: 700,
  },
=======
import type {
  PartsStyleFunction,
  PartsStyleObject,
  SystemStyleFunction,
  SystemStyleObject,
} from "@chakra-ui/theme-tools";
import type { ComponentMultiStyleConfig } from '@chakra-ui/theme';

import { checkboxAnatomy as parts } from "@chakra-ui/anatomy";

const controlBaseStyle: SystemStyleObject = {
  fontSize: 'md',
  lineHeight: 1.5,
  margin: 0,
>>>>>>> feat(tabs): add tabs to chakra theme
};

const Checkbox: ComponentMultiStyleConfig = {
  parts: parts.keys,
  baseStyle: {
<<<<<<< HEAD
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
        width: 'calc(1rem - 2px)',
        height: 'calc(1rem - 2px)',
        transitionProperty: 'unset',
        transitionDuration: 'unset'
      },
    },
  },
  defaultProps: {
    colorScheme: 'uikit',
    size: 'md',
  },
};
=======
    control: controlBaseStyle,
  },
  defaultProps: {
    colorScheme: 'uikit',
  }
}
>>>>>>> feat(tabs): add tabs to chakra theme

export default Checkbox;

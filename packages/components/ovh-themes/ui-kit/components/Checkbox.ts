// eslint-disable-next-line prettier/prettier
<<<<<<< HEAD
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
=======
import type { SystemStyleObject } from "@chakra-ui/theme-tools";
>>>>>>> feat(checkbox): add checkbox styles
import type { ComponentMultiStyleConfig } from '@chakra-ui/theme';
import { checkboxAnatomy as parts } from '@chakra-ui/anatomy';

const controlBaseStyle: SystemStyleObject = {
  fontSize: 'md',
  margin: 0,
<<<<<<< HEAD
>>>>>>> feat(tabs): add tabs to chakra theme
=======
  borderColor: 'uikit.500',
  boxSizing: 'border-box',
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
>>>>>>> feat(checkbox): add checkbox styles
};

const Checkbox: ComponentMultiStyleConfig = {
  parts: parts.keys,
  baseStyle: {
<<<<<<< HEAD
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
=======
    container: containerBaseStyle,
>>>>>>> feat(checkbox): add checkbox styles
    control: controlBaseStyle,
    label: labelBaseStyle,
  },
  defaultProps: {
    colorScheme: 'uikit',
<<<<<<< HEAD
  }
}
>>>>>>> feat(tabs): add tabs to chakra theme
=======
  },
};
>>>>>>> feat(checkbox): add checkbox styles

export default Checkbox;

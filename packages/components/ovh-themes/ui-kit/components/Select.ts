import { ComponentMultiStyleConfig } from '@chakra-ui/theme';
import { selectAnatomy as parts } from '@chakra-ui/anatomy';

import {
<<<<<<< HEAD
  defaultVariantFieldStyles,
  inputFieldStyles,
  successVariantFieldStyles,
  warningVariantFieldStyles,
} from './Input';

const iconBaseStyle = (isInvalid: boolean) => {
  return {
    color: isInvalid ? 'error.500' : 'uikit.500',
    fontSize: '2xl',
    margin: 0,
    minWidth: '2rem',
    padding: 0,
    right: '0.5',
  };
};

const Select: ComponentMultiStyleConfig = {
  parts: parts.keys,
  baseStyle: (props) => {
    return {
      ...inputFieldStyles,
      icon: {
        ...iconBaseStyle(props.isInvalid),
      },
    };
=======
  inputFieldStyles,
  defaultVariantFieldStyles,
  warningVariantFieldStyles,
  successVariantFieldStyles,
} from './Input';

const iconBaseStyle = (isInvalid: boolean) => {
  return {
    minWidth: '2rem',
    height: '2rem',
    margin: 0,
    padding: 0,
    fontSize: '2xl',
    color: isInvalid ? 'error.500' : 'uikit.500',
    right: '0.5',
  };
};

const Select: ComponentMultiStyleConfig = {
  parts: parts.keys,
<<<<<<< HEAD
  baseStyle: {
    ...inputFieldStyles,
    icon: {
      minWidth: '2rem',
      height: '2rem',
      margin: 0,
      padding: 0,
      fontSize: '2xl',
      color: 'uikit.500',
      right: '0.5',
    },
>>>>>>> feat(theme): add select theme to chakra
=======
  baseStyle: (props) => {
    return {
      ...inputFieldStyles,
      icon: {
        ...iconBaseStyle(props.isInvalid),
      },
    };
>>>>>>> fix(select): fix color icon on status
  },
  variants: {
    default: {
      ...defaultVariantFieldStyles,
    },
    warning: {
      ...warningVariantFieldStyles,
<<<<<<< HEAD
<<<<<<< HEAD
      icon: {
        color: 'warning.500',
      },
    },
    success: {
      ...successVariantFieldStyles,
      icon: {
        color: 'success.500',
      },
    },
  },
  sizes: {
    md: {
      field: {
        height: 'initial',
      },
=======
    },
    success: {
      ...successVariantFieldStyles,
>>>>>>> feat(theme): add select theme to chakra
=======
      icon: {
        color: 'warning.500',
      },
    },
    success: {
      ...successVariantFieldStyles,
      icon: {
        color: 'success.500',
      },
>>>>>>> fix(select): fix color icon on status
    },
  },
  defaultProps: {
    variant: 'default',
  },
};

export default Select;

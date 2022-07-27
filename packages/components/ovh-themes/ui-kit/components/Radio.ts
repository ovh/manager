import { radioAnatomy as parts } from '@chakra-ui/anatomy';
import { ComponentMultiStyleConfig } from '@chakra-ui/theme';

const applyContainerStyleColor = (color: string) => {
  return {
    background: 'white',
    color,
    borderColor: color,
  };
};

const checkedStyles = {
  background: 'white',
  color: 'uikit.500',
  _before: {
    width: '70%',
    height: '70%',
  },
};

const controlStyles = {
  background: 'white',
  borderColor: 'uikit.500',
  _hover: {
    borderColor: 'uikit.700',
  },
  _disabled: {
    ...applyContainerStyleColor('uikit.500'),
    color: 'uikit.800-text',
    _hover: {
      ...applyContainerStyleColor('uikit.500'),
    },
    _checked: { ...checkedStyles, borderColor: 'uikit.500' },
  },
  _invalid: {
    ...applyContainerStyleColor('error.500'),
    _hover: {
      ...applyContainerStyleColor('error.500'),
    },
  },
  _checked: {
    ...checkedStyles,
    _hover: {
      ...applyContainerStyleColor('uikit.700'),
    },
    _focus: {
      boxShadow: 'secondary',
    },
    _focusVisible: {
      outline: '2px dashed green',
      outlineOffset: '2px',
    },
  },
};

const labelStyles = {
  color: 'uikit.800-text',
  _checked: {
    fontWeight: 700,
  },
};

const Radio: ComponentMultiStyleConfig = {
  parts: parts.keys,
  baseStyle: {
    container: {
      _disabled: {
        opacity: '0.5',
      },
      _focusVisible: {
        outline: '2px solid green',
      },
    },
    control: controlStyles,
    label: labelStyles,
  },
  defaultProps: {
    colorScheme: 'uikit',
  },
};

export default Radio;

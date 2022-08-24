import { ComponentMultiStyleConfig } from '@chakra-ui/theme';
import { controlBaseStyle } from './Checkbox';

const parts = ['container', 'checkbox', 'footer', 'control'];

const ThumbnailChoice: ComponentMultiStyleConfig = {
  parts,
  baseStyle: {
    container: {
      background: 'transparent',
      transitionProperty: 'common',
      transitionDuration: 'normal',
      cursor: 'pointer',
      width: 'full',
      _hover: {
        background: 'uikit.200',
      },
      _checked: {
        background: 'uikit.100',
        _hover: {
          background: 'uikit.200',
        },
      },
    },
    checkbox: {
      pointerEvents: 'none',
    },
    control: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      verticalAlign: 'top',
      userSelect: 'none',
      flexShrink: 0,
      ...controlBaseStyle,
      _checked: {
        background: 'uikit.500',
      },
    },
  },
  variants: {
    default: {},
  },
  sizes: {
    md: {
      control: { width: 4, height: 4 },
    },
  },
  defaultProps: {
    variant: 'default',
    size: 'md',
  },
};

export default ThumbnailChoice;

// eslint-disable-next-line prettier/prettier
import type { ComponentStyleConfig } from '@chakra-ui/theme';
import type { SystemStyleObject } from '@chakra-ui/theme-tools';

const largeSize = '3.125rem';
const smallSize = '2rem';

const disabledStyles = (initialBg: string): SystemStyleObject => {
  return {
    opacity: '0.5',
    background: initialBg,
    boxShadow: 'none',
  };
};

const Button: ComponentStyleConfig = {
  baseStyle: {
    color: 'white',
    borderRadius: '6px',
    fontWeight: '700',
    borderWidth: '2px',
    borderColor: 'uikit.500',
    _disabled: disabledStyles('uikit.500'),
    _hover: {
      _disabled: {
        ...disabledStyles('uikit.500'),
        borderColor: 'uikit.500',
      },
      borderColor: 'uikit.700',
      boxShadow: '0 4px 6px 0 rgba(0, 14, 156, 0.2)',
    },
    _active: {
      borderColor: 'uikit.800',
    },
  },
  sizes: {
    large: {
      fontSize: 'lg',
      minHeight: largeSize,
      minWidth: largeSize,
      lineHeight: '1.125rem',
      px: '0.75rem',
      py: '0.75rem',
      letterSpacing: '0.007em',
    },
    small: {
      fontSize: 'md',
      minHeight: smallSize,
      minWidth: smallSize,
      lineHeight: '1rem',
      px: '0.35rem',
      py: '0.25rem',
      letterSpacing: '0.007em',
    },
    block: {
      fontSize: 'md',
      minHeight: smallSize,
      minWidth: '100%',
      lineHeight: '1rem',
      px: '0.35rem',
      py: '0.25rem',
      letterSpacing: '0.007em',
    },
  },
  variants: {
    primary: {
      background: 'uikit.500',
      color: 'white',
      _hover: {
        background: 'uikit.700',
      },
      _active: {
        background: 'uikit.800',
      },
    },
    secondary: {
      background: 'white',
      color: 'uikit.500',
      _disabled: {
        ...disabledStyles('white'),
      },
      _hover: {
        background: 'uikit.100',
        borderColor: 'uikit.500',
        _disabled: {
          ...disabledStyles('white'),
        },
      },
      _active: {
        background: 'uikit.200',
        borderColor: 'uikit.500',
      },
    },
    ghost: {
      background: 'white',
      color: 'uikit.500',
      borderColor: 'transparent',
      _disabled: {
        ...disabledStyles('white'),
      },
      _hover: {
        background: 'uikit.100',
        borderColor: 'uikit.100',
        _disabled: {
          ...disabledStyles('white'),
          borderColor: 'white',
        },
      },
      _active: {
        background: 'uikit.200',
        borderColor: 'uikit.200',
      },
    },
  },
  defaultProps: {
    size: 'small',
    variant: 'primary',
    colorScheme: 'uikit',
  },
};

export default Button;

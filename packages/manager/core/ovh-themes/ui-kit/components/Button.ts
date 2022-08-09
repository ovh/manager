import { ComponentStyleConfig } from '@chakra-ui/theme';
import { SystemStyleObject } from '@chakra-ui/system';

const largeSize = '3.125rem';
const smallSize = '2rem';

const disabledStyles = (initialBg: string): SystemStyleObject => {
  return {
    opacity: '0.5',
    background: initialBg,
    boxShadow: 'none',
    cursor: 'not-allowed',
  };
};

const tableStyle = {
  background: 'uikit.100',
  borderColor: 'uikit.100',
  _disabled: {
    ...disabledStyles('transparent'),
    borderColor: 'transparent',
  },
};

const secondaryStyle = {
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
      boxShadow: 'secondary',
    },
    _active: {
      borderColor: 'uikit.800',
    },
  },
  sizes: {
    large: {
      fontSize: 'lg',
      height: largeSize,
      minWidth: largeSize,
      lineHeight: '1.125rem',
      px: '0.75rem',
      py: '0.75rem',
      letterSpacing: '0.007em',
    },
    small: {
      fontSize: 'md',
      height: smallSize,
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
    secondary: secondaryStyle,
    table: {
      ...tableStyle,
      color: 'uikit.500',
      _hover: {
        ...tableStyle,
        color: 'uikit.600',
        boxShadow: 'none',
      },
      _active: {
        borderColor: 'uikit.100',
      },
      padding: 0,
    },
    menu: {
      ...secondaryStyle,
      _active: {
        // eslint-disable-next-line no-underscore-dangle
        ...secondaryStyle._active,
        background: 'uikit.500',
        color: 'white',
      },
    },
    iconMenu: {
      ...secondaryStyle,
      borderRadius: '50%',
      _active: {
        // eslint-disable-next-line no-underscore-dangle
        ...secondaryStyle._active,
        background: 'uikit.500',
        color: 'white',
      },
    },
    ghost: {
      background: 'transparent',
      color: 'uikit.500',
      borderColor: 'transparent',
      _disabled: {
        ...disabledStyles('transparent'),
      },
      _hover: {
        background: 'uikit.100',
        borderColor: 'uikit.100',
        _disabled: {
          ...disabledStyles('transparent'),
          borderColor: 'transparent',
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

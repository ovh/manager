// eslint-disable-next-line prettier/prettier
import type { ComponentStyleConfig } from '@chakra-ui/theme';
import type { SystemStyleObject } from '@chakra-ui/theme-tools';

const largeSize = '3.125rem';
const smallSize = '2rem';

<<<<<<< HEAD
<<<<<<< HEAD
const disabledStyles = (initialBg: string): SystemStyleObject => {
=======
const disabledStyles = (initialBg: string) => {
>>>>>>> feat: separate tags and badges
=======
const disabledStyles = (initialBg: string): SystemStyleObject => {
>>>>>>> feat(chakra): add form control inputs styles
  return {
    opacity: '0.5',
    background: initialBg,
    boxShadow: 'none',
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> feat(theme): add tile
    cursor: 'not-allowed',
  };
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
<<<<<<< HEAD
=======
  };
};
>>>>>>> feat: separate tags and badges
=======
>>>>>>> feat(chakra): add action menu component

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
<<<<<<< HEAD
<<<<<<< HEAD
      boxShadow: 'secondary',
=======
      boxShadow: '0 4px 6px 0 rgba(0, 14, 156, 0.2)',
>>>>>>> feat: separate tags and badges
=======
      boxShadow: 'secondary',
>>>>>>> feat(theme): add tile
    },
    _active: {
      borderColor: 'uikit.800',
    },
  },
  sizes: {
    large: {
      fontSize: 'lg',
<<<<<<< HEAD
<<<<<<< HEAD
      height: largeSize,
=======
      minHeight: largeSize,
>>>>>>> feat(chakra): add form control inputs styles
=======
      height: largeSize,
>>>>>>> feat(theme): add tile
      minWidth: largeSize,
      lineHeight: '1.125rem',
      px: '0.75rem',
      py: '0.75rem',
      letterSpacing: '0.007em',
    },
    small: {
      fontSize: 'md',
<<<<<<< HEAD
<<<<<<< HEAD
      height: smallSize,
=======
      minHeight: smallSize,
>>>>>>> feat(chakra): add form control inputs styles
=======
      height: smallSize,
>>>>>>> feat(theme): add tile
      minWidth: smallSize,
      lineHeight: '1rem',
      px: '0.35rem',
      py: '0.25rem',
      letterSpacing: '0.007em',
    },
    block: {
<<<<<<< HEAD
<<<<<<< HEAD
      fontSize: 'md',
=======
      fontSize: '1rem',
>>>>>>> feat: separate tags and badges
=======
      fontSize: 'md',
>>>>>>> feat(chakra): add form control inputs styles
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
<<<<<<< HEAD
<<<<<<< HEAD
        // eslint-disable-next-line no-underscore-dangle
=======
>>>>>>> feat(chakra): add action menu component
=======
        // eslint-disable-next-line no-underscore-dangle
>>>>>>> feat(uikit): add radio buttons theme
        ...secondaryStyle._active,
        background: 'uikit.500',
        color: 'white',
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

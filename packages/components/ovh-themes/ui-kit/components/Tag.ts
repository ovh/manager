// eslint-disable-next-line prettier/prettier
import type { ComponentMultiStyleConfig } from '@chakra-ui/theme';
import type { PartsStyleObject } from '@chakra-ui/theme-tools';
<<<<<<< HEAD

const chipBaseStyles = (closable?: boolean): PartsStyleObject => {
  const hover = closable
    ? {
        _hover: {
          background: 'uikit.200',
          cursor: 'pointer',
        },
      }
    : {};

  const active = closable
    ? {
        _active: {
          background: 'uikit.300',
        },
      }
    : {};

  return {
    container: {
      fontSize: 'sm',
      height: '2rem',
      px: closable ? '0.75rem' : '1rem',
      py: 0,
      transitionProperty: 'common',
      transitionDuration: 'normal',
      color: 'uikit.800',
      ...hover,
      ...active,
    },
    closeButton: {
      width: '1rem',
      height: '1rem',
      color: 'uikit.800',
      opacity: '1',
      px: 0,
      fontWeight: '200',
      fontSize: 'md',
      _hover: {
        color: 'uikit.800',
        opacity: '1',
      },
    },
  };
};
=======
>>>>>>> feat(chakra): add form control inputs styles


const chipBaseStyles = (closable?: boolean): PartsStyleObject => {
  const hover = closable
    ? {
        _hover: {
          background: 'uikit.200',
          cursor: 'pointer',
        },
      }
    : {};

  const active = closable
    ? {
        _active: {
          background: 'uikit.300',
        },
      }
    : {};

  return {
    container: {
      fontSize: 'sm',
      height: '2rem',
      px: closable ? '0.75rem' : '1rem',
      py: 0,
      transitionProperty: 'common',
      transitionDuration: 'normal',
      color: 'uikit.800',
      ...hover,
      ...active,
    },
    closeButton: {
      color: 'uikit.800',
      opacity: '1',
      px: 0,
      fontWeight: '200',
      fontSize: 'md',
      _hover: {
        color: 'uikit.800',
        opacity: '1',
      },
    },
  };
};

const Tag: ComponentMultiStyleConfig = {
  parts: ['container', 'label', 'closeButton'],
  baseStyle: {
    container: {
      background: 'uikit.100',
      fontWeight: '500',
<<<<<<< HEAD
<<<<<<< HEAD
      borderRadius: '1rem',
      lineHeight: '1',
      margin: '0',
=======
      color: 'uikit.800-text',
=======
>>>>>>> feat(chakra): add form control inputs styles
      borderRadius: '1rem',
      lineHeight: '1',
      margin: '0',
    },
<<<<<<< HEAD
    closeButton: {
      color: 'uikit.800-text',
>>>>>>> feat: separate tags and badges
    },
=======
>>>>>>> feat(chakra): add form control inputs styles
  },
  sizes: {
    regular: {
      container: {
        fontSize: 'md',
        maxWidth: '12.5rem',
        lineHeight: '1rem',
      },
    },
  },
  variants: {
    chip: {
      ...chipBaseStyles(),
    },
    'closable-chip': {
      ...chipBaseStyles(true),
    },
  },
  defaultProps: {
    variant: 'chip',
    size: 'regular',
    colorScheme: 'uikit',
  },
};

export default Tag;

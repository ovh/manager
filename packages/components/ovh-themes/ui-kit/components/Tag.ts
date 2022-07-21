// eslint-disable-next-line prettier/prettier
import type { ComponentMultiStyleConfig } from '@chakra-ui/theme';

const chipBaseStyles = (closable?: boolean) => {
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
      fontSize: '0.875rem',
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
      fontSize: '1rem',
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
      color: 'uikit.800-text',
      borderRadius: '1rem',
      lineHeight: '1',
      margin: '0',
    },
    closeButton: {
      color: 'uikit.800-text',
    },
  },
  sizes: {
    regular: {
      container: {
        fontSize: '1rem',
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

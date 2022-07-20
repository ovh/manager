// eslint-disable-next-line prettier/prettier
import type { ComponentMultiStyleConfig } from '@chakra-ui/theme';

const Tag: ComponentMultiStyleConfig = {
  parts: ['container', 'label', 'closeButton'],
  baseStyle: {
    container: {
      margin: '0 0.25rem',
      padding: '0.15rem 0.5rem',
      fontWeight: '700',
      color: 'uikit.800-text',
      borderRadius: '1rem',
      lineHeight: '1',
    },
  },
  sizes: {
    regular: {
      container: {
        fontSize: '1rem',
        maxWidth: '12.5rem',
        lineHeight: '1rem',
      }
    },
    small: {
      container: {
        fontSize: '0.75rem',
        fontWeight: 800,
      }
    }
  },
  variants: {
    default: {
      container: {
        background: 'transparent'
      }
    },
    info: {
      container: {
        background: 'uikit.100',
      }
    },
    success: {
      container: {
        background: 'success.300',
        color: 'success.500',
      }
    },
    warning: {
      container: {
        background: 'warning.300',
        color: 'warning.500',
      }
    },
    error: {
      container: {
        background: 'error.300',
        color: 'error.500',
      }
    },
    alpha: {
      container: {
        background: 'product.alpha',
        color: 'uikit.800'
      }
    },
    beta: {
      container: {
        background: 'product.beta',
        color: 'uikit.800'
      }
    },
    new: {
      container: {
        background: 'product.new',
        color: 'uikit.800',
      }
    },
    soon: {
      container: {
        background: 'white'
      }
    },
    promotion: {
      container: {
        background: 'promotion.500',
        color: 'promotion.500-text'
      }
    },
    'price-drop': {
      container: {
        background: 'product.price-drop',
        color: 'uikit.800',
      }
    },
    'sold-out': {
      container: {
        background: 'product.sold-out',
        textTransform: 'uppercase'
      }
    },
    'best-seller': {
      container: {
        background: 'uikit.200',
        color: 'uikit.500'
      }
    },
    'limited-edition': {
      container: {
        background: 'product.limited-edition',
        color: 'white'
      }
    }
  },
  defaultProps: {
    variant: 'default',
    size: 'regular',
    colorScheme: 'uikit',
  }
};

export default Tag;


// eslint-disable-next-line prettier/prettier
import type { ComponentStyleConfig } from '@chakra-ui/theme';

const Badge: ComponentStyleConfig = {
  baseStyle: {
    padding: '0.15rem 0.5rem',
    fontWeight: '700',
    color: 'uikit.800-text',
    borderRadius: '1rem',
    lineHeight: '1',
    margin: '0',
    textTransform: 'none',
  },
  sizes: {
    regular: {
      fontSize: '1rem',
      maxWidth: '12.5rem',
      lineHeight: '1rem',
    },
    small: {
      fontSize: '0.75rem',
      fontWeight: 800,
    },
  },
  variants: {
    default: {
      background: 'transparent',
    },
    info: {
      background: 'uikit.100',
    },
    success: {
      background: 'success.300',
      color: 'success.500',
    },
    warning: {
      background: 'warning.300',
      color: 'warning.500',
    },
    error: {
      background: 'error.300',
      color: 'error.500',
    },
    alpha: {
      background: 'product.alpha',
      color: 'uikit.800',
    },
    beta: {
      background: 'product.beta',
      color: 'uikit.800',
    },
    new: {
      background: 'product.new',
      color: 'uikit.800',
    },
    soon: {
      background: 'white',
    },
    promotion: {
      background: 'promotion.500',
      color: 'promotion.500-text',
    },
    'price-drop': {
      background: 'product.price-drop',
      color: 'uikit.800',
    },
    'sold-out': {
      background: 'product.sold-out',
      textTransform: 'uppercase',
    },
    'best-seller': {
      background: 'uikit.200',
      color: 'uikit.500',
    },
    'limited-edition': {
      background: 'product.limited-edition',
      color: 'white',
    },
  },
  defaultProps: {
    variant: 'default',
    size: 'regular',
    colorScheme: 'uikit',
  },
};

export default Badge;

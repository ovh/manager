import { accordionAnatomy as parts } from '@chakra-ui/anatomy';
import { ComponentMultiStyleConfig } from '@chakra-ui/theme';

const Accordion: ComponentMultiStyleConfig = {
  parts: parts.keys, // root, container, button, panel, icon
  baseStyle: {
    root: {
      borderRadius: 'medium',
      padding: 0,
      margin: 0,
    },
    container: {
      minHeight: '3.125rem',
      borderRadius: 'inherit',
      border: 'none',
      marginY: '4',
      boxSizing: 'border-box',
      transitionProperty: 'none',
      transitionDuration: '0',
    },
    panel: {
      borderColor: 'uikit.100',
      borderWidth: '0 1px 1px 1px',
      padding: '4',
      boxSizing: 'border-box',
      borderBottomRadius: 'medium',
      transition: 'none',
    },
    icon: {
      fontSize: '3xl',
    },
    button: {
      minHeight: 'inherit',
      borderColor: 'uikit.100',
      borderWidth: '1px',
      transition: 'none',
      borderRadius: 'medium',
      color: 'uikit.500',
      fontWeight: '700',
      fontSize: 'lg',
      _hover: {
        background: 'uikit.100',
        borderColor: 'uikit.500',
      },
      _expanded: {
        color: 'uikit.800-text',
        borderWidth: '1px 1px 0 1px',
        borderBottomRadius: '0',
        _hover: {
          background: 'uikit.100',
          borderColor: 'uikit.500',
          '+ div.chakra-collapse': {
            background: 'uikit.100',
            borderColor: 'uikit.500',
            borderWidth: '0 1px 1px 1px',
            borderBottomRadius: 'medium',
            padding: 0,
            '> div.chakra-accordion__panel': {
              borderWidth: '0',
            },
          },
        },
      },
    },
  },
  variants: {
    default: {},
  },
  defaultProps: {
    variant: 'default',
  },
};

export default Accordion;

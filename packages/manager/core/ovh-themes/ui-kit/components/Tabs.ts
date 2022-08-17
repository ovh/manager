// eslint-disable-next-line prettier/prettier
import type { ComponentMultiStyleConfig } from '@chakra-ui/theme';
import { tabsAnatomy as parts } from '@chakra-ui/anatomy';

const Tabs: ComponentMultiStyleConfig = {
  parts: parts.keys,
  baseStyle: {
    tab: {
      height: '14',
      background: 'white',
      spacing: '1',
      borderRadius: 'medium',
      borderBottomRadius: '0px',
      color: 'uikit.500',
      fontSize: 'lg',
      fontWeight: 700,
      lineHeight: 'shorter',
      letterSpacing: '0.007em',
      boxSizing: 'border-box',
      borderWidth: '.125rem',
      whiteSpace: 'nowrap',
    },
    tabpanels: {
      padding: '1rem',
    },
    tabpanel : {
      borderBottomRadius: 'medium',
    }
  },
  variants: {
    enclosed: {
      tab: {
        borderColor: 'uikit.100',
        _selected: {
          background: 'uikit.50',
          borderColor: 'uikit.100',
          color: 'uikit.800-text',
          _hover: {
            background: 'uikit.50',
          },
        },
        _hover: {
          background: 'uikit.100',
        },
      },
      tabpanel: {
        background: 'uikit.50',
        borderColor: 'uikit.100',
        borderWidth: '1px',
      },
    },
    light: {
      tab: {
        borderColor: 'white',
        borderRadius: '0px',
        borderWidth: '0',
        borderBottomWidth: '.125rem',
        marginRight: '1.5rem',
        _selected: {
          borderBottomColor: 'uikit.500',
        },
        _hover: {
          color: 'uikit.700',
          borderBottomColor: 'uikit.700',
        }
      }
    }
  },
  defaultProps: {
    variant: 'enclosed',
  },
};

export default Tabs;

// eslint-disable-next-line prettier/prettier
import type { ComponentMultiStyleConfig } from '@chakra-ui/theme';
import { tabsAnatomy as parts } from "@chakra-ui/anatomy";

const Tabs: ComponentMultiStyleConfig = {
  parts: parts.keys,
  variants: {
    enclosed: {
      tab: {
        height: '14',
        background: 'white',
        spacing: '1',
        borderRadius: '6px',
        borderBottomRadius: '0px',
        borderColor: 'uikit.100',
        color: 'uikit.500',
        fontSize: 'lg',
        fontWeight: 700,
        lineHeight: 'shorter',
        letterSpacing: '0.007em',
        _selected: {
          color: 'uikit.800-text',
          background: 'uikit.50',
          borderColor: 'uikit.100',
          _hover: {
            background: 'uikit.50'
          }
        },
        _hover: {
          background: 'uikit.100',
        }
      },
      tabpanel : {
        background: 'uikit.50',
        borderColor: 'uikit.100',
        borderWidth: '1px',
        borderBottomRadius: '6px'
      },
    }
  },
  defaultProps: {
    variant: 'enclosed'
  }
}

export default Tabs;

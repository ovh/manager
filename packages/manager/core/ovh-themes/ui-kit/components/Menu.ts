import { ComponentMultiStyleConfig } from '@chakra-ui/theme';
import { menuAnatomy as parts } from '@chakra-ui/anatomy';
import { SystemStyleFunction } from '@chakra-ui/theme-tools';

// const itemStyle: SystemStyleFunction = (props) => {
//   console.log(props);
//   const { icon } = props;
//   console.log('icon', icon);
//   return;
// };

const Menu: ComponentMultiStyleConfig = {
  parts: parts.keys, // button, item, list, groupTitle, command, divider
  baseStyle: {
    // return {
    list: {
      backgroundColor: '#fff',
      border: '0',
      borderRadius: 'medium',
      boxShadow: 'primary',
      margin: 0,
      maxWidth: '18.75rem',
      minWidth: '8.75rem',
      padding: 0,
      textAlign: 'initial',
    },
    groupTitle: {
      fontSize: '.875rem',
      fontWeight: '700',
      lineHeight: '1rem',
      margin: 0,
      padding: '.5rem 1rem',
    },
    item: {
      backgroundColor: 'transparent',
      color: 'uikit.500',
      display: 'flex',
      fontWeight: '600',
      lineHeight: '1rem',
      padding: '.5rem 1rem',
      textAlign: 'left',
      // flexDirection: 'row-reverse',
      width: '100%',
      _focus: {
        backgroundColor: 'uikit.100',
      },
      _active: {
        backgroundColor: 'uikit.100',
        _disabled: {
          backgroundColor: 'inherit',
        },
      },
      _disabled: {
        opacity: 0.5,
      },
    },
    divider: {
      borderColor: 'gray.300',
      margin: '0 1rem',
    },
    // };
  },
  variants: {
    compact: {
      button: {
        borderRadius: '50%',
        height: '1.5rem',
        width: '1.5rem',
      },
    },
  },
  defaultProps: {
    colorScheme: 'uikit',
    variant: 'uikit',
  },
};

export default Menu;

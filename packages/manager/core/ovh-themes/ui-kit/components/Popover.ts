import { popoverAnatomy as parts } from '@chakra-ui/anatomy';
import { ComponentMultiStyleConfig } from '@chakra-ui/theme';

const Popover: ComponentMultiStyleConfig = {
  parts: parts.keys, // Header, closeButton, body, footer, content, popper, arrow
  baseStyle: {
    arrow: {
      boxShadow: 'primary',
    },
    popper: {
      boxShadow: 'primary',
      border: 'none',
      borderRadius: 'medium',
    },
    header: {
      border: 'none',
      fontWeight: 700,
    },
    content: {
      border: 'none',
    },
    closeButton: {
      fontSize: 'xs',
      marginTop: '1',
    },
  },
};

export default Popover;

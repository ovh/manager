// eslint-disable-next-line prettier/prettier
import type { ComponentStyleConfig } from '@chakra-ui/theme';

import { breadcrumbAnatomy as parts } from '@chakra-ui/anatomy';

const Breadcrumb: ComponentStyleConfig = {
  parts: parts.keys,
  baseStyle: {
    link: {
      color: '',
      cursor: '',
      _hover: {
        textDecoration: '',
      },
    },
    separator: {
      pointerEvents: 'none',
    },
  },
  defaultProps: {
    colorScheme: 'uikit',
  },
};

export default Breadcrumb;

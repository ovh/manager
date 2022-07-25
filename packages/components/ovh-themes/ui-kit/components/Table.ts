// eslint-disable-next-line prettier/prettier
import type { ComponentMultiStyleConfig } from '@chakra-ui/theme';
import { tableAnatomy as parts } from "@chakra-ui/anatomy"

const Table: ComponentMultiStyleConfig = {
  parts: parts.keys, // table, thead, tbody, tr, th, td, tfoot, caption
  baseStyle: {
    table: {
      border: '1px solid',
      borderBottom: 'none',
      borderCollapse: 'separate',
      borderColor: 'uikit.100',
      borderSpacing: 0,
      textAlign: 'left',
    },
    td: {
      background: 'none',
      borderBottom: '1px solid',
      borderColor: 'uikit.100',
<<<<<<< HEAD
      cursor: 'default',
    },
    tr: {
      lineHeight: '1.5',
      fontWeight: 'inherit'
=======
      color: 'uikit.800-text',
      cursor: 'default',
    },
    tr: {
<<<<<<< HEAD
      fontWeight: 'inherit',
>>>>>>> feat(chakra): add Table component style
=======
      fontWeight: '500',
      lineHeight: '1.5',
>>>>>>> feat(tabs): add tabs to chakra theme
    },
    thead: {
      backgroundColor: 'uikit.100',
      border: '1px solid',
      borderColor: 'uikit.100',
<<<<<<< HEAD
<<<<<<< HEAD
      fontWeight: 700,
    },
    th: {
      fontFamily: 'inherit',
      textTransform: 'none',
      fontWeight: 'inherit',
    },
    tfoot: {
      backgroundColor: 'uikit.100',
      fontWeight: 500,
=======
      fontWeight: '700',
=======
      fontWeight: '900',
>>>>>>> feat(tabs): add tabs to chakra theme
    },
    th: {
      color: 'uikit.800-text',
      fontFamily: 'inherit',
      fontWeight: '700',
      textTransform: 'none',
    },
    tfoot: {
      backgroundColor: 'uikit.100',
>>>>>>> feat(chakra): add Table component style
    },
  },
  sizes: {
    md: {
      table: {
<<<<<<< HEAD
        fontSize: 'md',
      },
      td: {
        height: '2.5rem',
        padding: '0 .5rem',
      },
      th: {
        fontSize: 'md',
        height: '2.625rem',
        padding: '.25rem .5rem',
=======
        fontSize: '1rem',
      },
      td: {
        height: '2.5rem',
        paddingTop: 0,
        paddingRight: '.5rem',
        paddingBottom: 0,
        paddingLeft: '.5rem',
      },
      th: {
        fontSize: '1rem',
        height: '2.625rem',
<<<<<<< HEAD
        paddingTop: '.25rem',
        paddingRight: '.5rem',
        paddingBottom: '.25rem',
        paddingLeft: '.5rem',
>>>>>>> feat(chakra): add Table component style
=======
        padding: '.25rem .5rem',
>>>>>>> feat(tabs): add tabs to chakra theme
      },
    },
  },
  defaultProps: {
    colorScheme: 'uikit',
    variant: 'unstyled',
  },
};

export default Table;

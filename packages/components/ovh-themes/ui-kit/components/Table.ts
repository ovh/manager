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
      color: 'uikit.800-text',
      cursor: 'default',
    },
    tr: {
      lineHeight: '1.5',
      fontWeight: 'inherit'
    },
    thead: {
      backgroundColor: 'uikit.100',
      border: '1px solid',
      borderColor: 'uikit.100',
      fontWeight: 700,
    },
    th: {
      color: 'uikit.800-text',
      fontFamily: 'inherit',
      textTransform: 'none',
      fontWeight: 'inherit',
    },
    tfoot: {
      backgroundColor: 'uikit.100',
      fontWeight: 500,
    },
  },
  sizes: {
    md: {
      table: {
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
        padding: '.25rem .5rem',
      },
    },
  },
  defaultProps: {
    colorScheme: 'uikit',
    variant: 'unstyled',
  },
};

export default Table;

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
      fontFamily: 'inherit',
      textTransform: 'none',
      fontWeight: 'inherit',
      backgroundColor: 'uikit.100',
      letterSpacing: '0.12px',
    },
    tfoot: {
      backgroundColor: 'uikit.100',
      fontWeight: 500,
    },
  },
  sizes: {
    md: {
      table: {
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
      },
    },
  },
  defaultProps: {
    colorScheme: 'uikit',
    variant: 'unstyled',
  },
};

export default Table;

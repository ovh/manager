export default {
  body: {
    color: 'uikit.800-text',
    fontFamily: 'Source Sans Pro',
    letterSpacing: '0.12px',
  },
  /* Link */
  a: {
    color: 'uikit.500',
    cursor: 'pointer',
    fontWeight: 600,
    _hover: {
      color: 'uikit.700',
      textDecoration: 'underline',
    },
  },
  /* Abbreviation */
  'abbr[title]': {
    borderBottom: '1px dashed',
    borderColor: 'uikit.400',
    textDecoration: 'none',
    cursor: 'help',
  },
  /* Description */
  dd: {
    fontWeight: 400,
    marginLeft: 0,
    marginBottom: '.5rem',
  },
  dt: {
    fontWeight: 700,
  },
  'dl.horizontal': {
    dt: {
      clear: 'left',
      float: 'left',
      lineHeight: '1.25rem',
      margin: 0,
      padding: 0,
    },
    dd: {
      lineHeight: '1.25rem',
      margin: '0 0 .313rem',
      textAlign: 'right',
    },
    _after: {
      clear: 'left',
      content: '" "',
      display: 'block',
    },
  },
  /* Heading */
  'h1, h2, h3, h4, h5, h6': {
    color: 'uikit.800',
  },
  'h1, h2, h3, h4, h5': {
    lineHeight: 1.25,
  },
  h1: {
    fontSize: '7xl',
    fontWeight: 300,
  },
  h2: {
    fontSize: '5xl',
    fontWeight: 400,
    letterSpacing: 0,
  },
  h3: {
    fontSize: '4xl',
    fontWeight: 400,
    letterSpacing: 0,
  },
  h4: {
    fontSize: '1.75rem',
    fontWeight: 700,
  },
  h5: {
    fontSize: 'xl',
    fontWeight: 700,
  },
  h6: {
    fontSize: 'lg',
    fontWeight: 700,
    lineHeight: 1.5,
  },
  /* List */
  ul: {
    listStyle: 'none',
    ul: {
      paddingLeft: '.75rem',
    },
  },
  'ul.separated > li': {
    borderBottom: '1px solid',
    borderColor: 'uikit.200',
  },
  /* Paragraph */
  p: {
    wordBreak: 'normal',
  },
  /* keyboard focus */
  'button:focus-visible, a:focus-visible': {
    outlineColor: 'green !important',
    outlineStyle: 'dashed !important',
    outlineWidth: '2px !important',
  },
};

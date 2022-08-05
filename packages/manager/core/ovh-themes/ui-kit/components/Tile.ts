import { SystemStyleObject } from '@chakra-ui/system';
// eslint-disable-next-line prettier/prettier
import type { ComponentMultiStyleConfig } from '@chakra-ui/theme';
import Button from './Button';

const tileParts = [
  'container',
  'content',
  'group',
  'heading',
  'subheading',
  'headingAction',
  'section',
  'sectionButton',
  'sectionDefinition',
];

const containerBaseStyles: SystemStyleObject = {
  background: 'white',
  borderWidth: '1px',
  borderColor: 'gray.100',
  borderRadius: 'medium',
  boxShadow: 'primary',
  height: 'fit-content',
  padding: '4',
  width: '100%',
};

const headingBaseStyles: SystemStyleObject = {
  letterSpacing: '0.008rem',
  marginBottom: '4',
};

const buttonStyles: SystemStyleObject = {
  ...Button.baseStyle,
  ...Button.variants?.ghost,
  boxShadow: 'none',
  borderRadius: 0,
  display: 'flex',
  flex: 1,
  height: '10',
  justifyContent: 'space-between',
  padding: '.25rem .5rem',
  transitionProperty: 'common',
  transitionDuration: 'normal',
  width: '100%',
};

const sectionStyles: SystemStyleObject = {
  borderTopColor: 'gray.50',
  borderTopWidth: '1px',
  lineHeight: 1.5,
};

const sectionDefinitionStyles: SystemStyleObject = {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'space-between',
  padding: '.5rem .25rem',
  title: {
    color: 'uikit.800',
    fontWeight: 700,
  },
  description: {
    fontWeight: 500,
    wordBreak: 'break-all',
    fontSize: 'md',
  },
};

const groupStyles: SystemStyleObject = {
  fontSize: 'md',
  letterSpacing: '0.007rem',
  lineHeight: 1.5,
  marginTop: '4',
  'div:last-of-type': {
    borderBottomWidth: '1px',
    borderBottomColor: 'gray.50',
  },
};

const commonBoxStyles: SystemStyleObject = {
  borderColor: 'uikit.100',
  boxShadow: 'none',
  padding: '1rem 2rem 2rem',
};

const Tile: ComponentMultiStyleConfig = {
  parts: tileParts,
  baseStyle: {
    container: containerBaseStyles,
    group: groupStyles,
    heading: headingBaseStyles,
    section: sectionStyles,
    sectionButton: buttonStyles,
    sectionDefinition: sectionDefinitionStyles,
  },
  variants: {
    box: {
      container: {
        ...commonBoxStyles,
        background: 'uikit.50',
      },
    },
    'light-box': {
      container: {
        ...commonBoxStyles,
      },
    },
  },
};

export default Tile;

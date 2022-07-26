import { SystemStyleObject } from '@chakra-ui/theme-tools';
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
  boxShadow: 'primary',
  borderWidth: '1px',
  borderColor: 'gray.100',
  padding: '4',
  borderRadius: 'medium',
  width: '100%',
  height: 'fit-content',
};

const headingBaseStyles: SystemStyleObject = {
  letterSpacing: '0.008rem',
  marginBottom: '4',
};

const contentBaseStyles: SystemStyleObject = {
  color: 'uikit.800-text',
};

const buttonStyles: SystemStyleObject = {
  ...Button.baseStyle,
  ...Button.variants?.ghost,
  boxShadow: 'none',
  width: '100%',
  borderRadius: 0,
  display: 'flex',
  flex: 1,
  padding: '.25rem .5rem',
  justifyContent: 'space-between',
  transitionProperty: 'common',
  transitionDuration: 'normal',
  height: '10',
};

const sectionStyles: SystemStyleObject = {
  borderTopWidth: '1px',
  borderTopColor: 'gray.50',
  lineHeight: 1.5,
};

const sectionDefinitionStyles: SystemStyleObject = {
  display: 'flex',
  alignItems: 'center',
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
  lineHeight: 1.5,
  color: 'uikit.800-text',
  letterSpacing: '0.007rem',
  fontSize: 'md',
  marginTop: '4',
  'div:last-of-type': {
    borderBottomWidth: '1px',
    borderBottomColor: 'gray.50',
  },
};

const commonBoxStyles: SystemStyleObject = {
  boxShadow: 'none',
  borderColor: 'uikit.100',
  padding: '1rem 2rem 2rem',
};

const Tile: ComponentMultiStyleConfig = {
  parts: tileParts,
  baseStyle: {
    container: containerBaseStyles,
    heading: headingBaseStyles,
    content: contentBaseStyles,
    sectionButton: buttonStyles,
    group: groupStyles,
    section: sectionStyles,
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

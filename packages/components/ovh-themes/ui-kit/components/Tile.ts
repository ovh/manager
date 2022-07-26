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
<<<<<<< HEAD
  borderWidth: '1px',
  borderColor: 'gray.100',
  borderRadius: 'medium',
  boxShadow: 'primary',
  height: 'fit-content',
  padding: '4',
  width: '100%',
=======
  boxShadow: 'primary',
  borderWidth: '1px',
  borderColor: 'gray.100',
  padding: '4',
  borderRadius: 'medium',
  width: '100%',
  height: 'fit-content',
>>>>>>> feat(theme): add tile
};

const headingBaseStyles: SystemStyleObject = {
  letterSpacing: '0.008rem',
  marginBottom: '4',
};

<<<<<<< HEAD
=======
const contentBaseStyles: SystemStyleObject = {
  color: 'uikit.800-text',
};

>>>>>>> feat(theme): add tile
const buttonStyles: SystemStyleObject = {
  ...Button.baseStyle,
  ...Button.variants?.ghost,
  boxShadow: 'none',
<<<<<<< HEAD
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
=======
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
>>>>>>> feat(theme): add tile
  lineHeight: 1.5,
};

const sectionDefinitionStyles: SystemStyleObject = {
<<<<<<< HEAD
  alignItems: 'center',
  display: 'flex',
=======
  display: 'flex',
  alignItems: 'center',
>>>>>>> feat(theme): add tile
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
<<<<<<< HEAD
  fontSize: 'md',
  letterSpacing: '0.007rem',
  lineHeight: 1.5,
=======
  lineHeight: 1.5,
  color: 'uikit.800-text',
  letterSpacing: '0.007rem',
  fontSize: 'md',
>>>>>>> feat(theme): add tile
  marginTop: '4',
  'div:last-of-type': {
    borderBottomWidth: '1px',
    borderBottomColor: 'gray.50',
  },
};

<<<<<<< HEAD
<<<<<<< HEAD
const commonBoxStyles: SystemStyleObject = {
  borderColor: 'uikit.100',
  boxShadow: 'none',
  padding: '1rem 2rem 2rem',
};

=======
>>>>>>> feat(theme): add tile
=======
const commonBoxStyles: SystemStyleObject = {
  boxShadow: 'none',
  borderColor: 'uikit.100',
  padding: '1rem 2rem 2rem',
};

>>>>>>> feat(theme): add box variant
const Tile: ComponentMultiStyleConfig = {
  parts: tileParts,
  baseStyle: {
    container: containerBaseStyles,
<<<<<<< HEAD
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
=======
    heading: headingBaseStyles,
    content: contentBaseStyles,
    sectionButton: buttonStyles,
    group: groupStyles,
    section: sectionStyles,
    sectionDefinition: sectionDefinitionStyles,
  },
<<<<<<< HEAD
>>>>>>> feat(theme): add tile
=======
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
>>>>>>> feat(theme): add box variant
};

export default Tile;

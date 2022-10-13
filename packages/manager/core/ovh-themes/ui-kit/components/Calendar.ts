/* eslint-disable no-underscore-dangle */
import { SystemStyleObject } from '@chakra-ui/system';
import { ComponentMultiStyleConfig } from '@chakra-ui/theme';
import { buttonBaseStyles, ghostStyles, primaryStyles } from './Button';

const headerStyles: SystemStyleObject = {
  fontSize: 'xl',
  fontWeight: 700,
  color: 'uikit.800',
  paddingX: '.3rem',
  borderRadius: 'md',
  transitionProperty: 'common',
  transitionDuration: 'normal',
  '::first-letter': {
    textTransform: 'capitalize',
  },
};
const lgWidth = '2.75rem';
const smWidth = '2.3rem';
const xsWidth = '2rem';

const buttonWidth = {
  md: lgWidth,
  sm: smWidth,
  xs: xsWidth,
};

const commontDateButtonStyles = {
  ...buttonBaseStyles,
  ...ghostStyles,
  transitionProperty: 'common',
  transitionDuration: 'normal',
  fontWeight: '600',
  color: 'uikit.800-text',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  width: buttonWidth,
  height: '1.5rem',
  marginTop: '.75rem',
  _hover: {
    ...(ghostStyles as any)._hover,
    color: 'uikit.500',
    fontWeight: 700,
    _disabled: {
      color: 'uikit.800-text',
      background: 'transparent',
      fontWeight: '600',
      borderColor: 'transparent',
    },
  },
  _pressed: {
    ...primaryStyles,
    fontWeight: 700,
    _hover: {
      ...primaryStyles._hover,
      borderColor: 'uikit.700',
    },
  },
  borderWidth: 0,
};

const Calendar: ComponentMultiStyleConfig = {
  parts: [
    'root',
    'headerText',
    'headerIcons',
    'divider',
    'main',
    'week',
    'grid',
    'dateButton',
    'monthButton',
  ],
  baseStyle: {
    root: {
      display: 'flex',
      alignItems: 'center',
      width: 'fit-content',
      flexDirection: 'column',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '3.5rem',
    },
    headerText: {
      ...headerStyles,
      _hover: {
        background: 'uikit.100',
      },
      _active: {
        background: 'uikit.200',
      },
    },
    headerButtons: {
      ...buttonBaseStyles,
      ...ghostStyles,
      transitionProperty: 'common',
      transitionDuration: 'normal',
      _hover: {
        background: 'transparent',
        color: 'uikit.700',
      },
      _active: {
        background: 'transparent',
        color: 'uikit.700',
      },
    },
    headerIcons: {
      width: '1.5rem',
      height: '1.5rem',
      color: 'inherit',
    },
    week: {
      width: buttonWidth,
      textAlign: 'center',
      fontSize: 'md',
      fontWeight: 700,
      paddingTop: '.8rem',
      '::first-letter': {
        textTransform: 'capitalize',
      },
    },
    divider: {
      borderColor: 'uikit.100',
    },
    dateButton: {
      ...commontDateButtonStyles,
    },
    monthButton: {
      ...commontDateButtonStyles,
      width: '5.4rem',
      height: '2rem',
      boxSizing: 'border-box',
      padding: '1',
    },
  },
  variants: {
    default: {},
  },
  defaultProps: {
    variant: 'default',
    colorScheme: 'uitkit',
  },
};

export default Calendar;

import { ComponentMultiStyleConfig } from '@chakra-ui/theme';
import { controlBaseStyle } from './Checkbox';

const parts = ['container', 'checkbox', 'footer', 'control', 'label'];

const ThumbnailChoice: ComponentMultiStyleConfig = {
  parts,
  baseStyle: {
    container: {
      margin: '1',
      borderRadius: 'large',
      borderColor: 'uikit.200',
      borderWidth: '2px',
      paddingTop: '6',
      background: 'transparent',
      transitionProperty: 'common',
      transitionDuration: 'normal',
      cursor: 'pointer',
      width: 'full',
      _disabled: {
        opacity: '0.5',
        cursor: 'not-allowed',
        _checked: {
          background: 'transparent',

          _hover: {
            background: 'transparent',
            boxShadow: 'none',
            '> label > label > span.chakra-checkbox__control': {
              // opacity: 0.5,
              background: 'uikit.500',
              borderColor: 'uikit.500',
            },
            '> label': {
              cursor: 'not-allowed',
            },
          },
        },
        _hover: {
          background: 'transparent',
          boxShadow: 'none',
          borderColor: 'uikit.200',
          '> label > label > span.chakra-checkbox__control': {
            // opacity: 0.5,
            background: 'transparent',
            borderColor: 'uikit.500',
          },
          '> label': {
            cursor: 'not-allowed',
          },
        },
      },
      '> label > label > span.chakra-checkbox__control': {
        boxShadow: 'none',
      },
      _hover: {
        background: 'uikit.100',
        borderColor: 'uikit.500',
        boxShadow: 'primary',
        '> label > label > span.chakra-checkbox__control': {
          borderColor: 'uikit.700',
          _checked: {
            background: 'uikit.700',
          },
        },
      },
      _checked: {
        background: 'uikit.75',
        borderColor: 'uikit.500',
        _hover: {
          background: 'uikit.100',
        },
      },
      _invalid: {
        background: 'error.100',
        borderColor: 'error.300',
        '> div': {
          borderColor: 'error.300',
        },
        _hover: {
          background: 'error.300',
          borderColor: 'error.500',
          '> label > label > span.chakra-checkbox__control': {
            borderColor: 'error.500',
            _checked: {
              background: 'error.500',
            },
          },
          '> div': {
            borderColor: 'error.500',
          },
        },
      },
    },
    footer: {
      width: '100%',
      borderTopWidth: '1px',
      borderColor: 'uikit.200',
      paddingY: '2',
      textAlign: 'center',
      fontSize: 'xs',
    },
    label: {
      margin: 6,
    },
    checkbox: {
      pointerEvents: 'none',
    },
    control: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      verticalAlign: 'top',
      userSelect: 'none',
      flexShrink: 0,
      width: 4,
      height: 4,
      ...controlBaseStyle,
      _checked: {
        background: 'uikit.500',
      },
    },
    description: {
      marginInlineStart: '3rem',
      fontSize: 'sm',
    },
  },
  variants: {
    default: {},
  },
  defaultProps: {
    variant: 'default',
  },
};

export default ThumbnailChoice;

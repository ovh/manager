// eslint-disable-next-line prettier/prettier
import type { ComponentStyleConfig } from '@chakra-ui/theme';

import { progressAnatomy as parts } from '@chakra-ui/anatomy';

const Progress: ComponentStyleConfig = {
  parts: parts.keys, // label, track, filledTrack
  baseStyle: {
    filledTrack: {
      borderTopRightRadius: '.3125rem',
      borderBottomRightRadius: '.3125rem',
    },
    label: {
      color: 'uikit.700',
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: '1.67',
      marginTop: '.25rem',
      top:'calc(100% + 1rem)',
      position: 'initial',
      display: 'block',
      transform: 'none'
    },
    track: {
      borderRadius: '.3125rem',
      overflow: 'unset',
    },
  },
  sizes: {
    md: {
      track: {
        h: '.625rem',
      },
    },
  },
  variants: {
    error: {
      filledTrack: {
        bg: 'error.500',
      },
    },
    info: {
      filledTrack: {
        bg: 'uikit.500',
      },
    },
    success: {
      filledTrack: {
        bg: 'success.500',
      },
    },
    warning: {
      filledTrack: {
        bg: 'warning.400',
      },
    },
  },
  defaultProps: {
    variant: 'info',
  },
};

export default Progress;

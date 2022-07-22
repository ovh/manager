import colors from './foundations/colors';

import Badge from './components/Badge';
import Button from './components/Button';
import Input from './components/Input';
import Tag from './components/Tag';
import FormLabel from './components/FormLabel';
import FormErrorMessage from './components/FormErrorMessage';
import Form from './components/Form';

export default {
  styles: {
    global: {
      '*': {
        fontFamily: 'Source Sans Pro',
      },
      'button:focus-visible': {
        outlineColor: 'green !important',
        outlineStyle: 'dashed !important',
      },
      // This should be configurable under the component FormErrorMessage
      // But there seems to be a bug where we can't configure that component currently
      // Github Issue: https://github.com/chakra-ui/chakra-ui/issues/6262
      '.chakra-form__error-message': {
        color: 'error.500 !important',
        fontWeight: '500 !important',
        fontSize: 'xs !important',
        margin: '.25rem 0 !important',
        lineHeight: '1rem !important',
        letterSpacing: '0.008rem !important',
      },
    },
  },
  shadows: {
    // This is none because it's not the real outline property
    // it's just a shadow on focus-visible.
    // Outline styles are overriden in global styles.
    outline: 'none',
  },
  colors,
  components: {
    Button,
    Tag,
    Input,
    FormLabel,
    FormErrorMessage,
    Form,
    Badge,
  },
};

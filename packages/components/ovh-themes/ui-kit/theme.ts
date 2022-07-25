import colors from './foundations/colors';

import Alert from './components/Alert';
import Badge from './components/Badge';
import Button from './components/Button';
import Table from './components/Table';
import Input from './components/Input';
import Tag from './components/Tag';
import FormLabel from './components/FormLabel';
import FormError from './components/FormErrorMessage';
import Form from './components/Form';
import Checkbox from './components/Checkbox';
import Tabs from './components/Tabs';

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
    Alert,
    Button,
    Checkbox,
    Tag,
    Input,
    FormLabel,
    FormError,
    Form,
    Badge,
    Table,
    Tabs,
  },
};

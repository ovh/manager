<<<<<<< HEAD
<<<<<<< HEAD
import globalStyle from './foundations/global';
import colors from './foundations/colors';
import shadows from './foundations/shadows';
import radii from './foundations/radius';

import Accordion from './components/Accordion';
import Alert from './components/Alert';
import Badge from './components/Badge';
import Breadcrumb from './components/Breadcrumb';
import Button from './components/Button';
import Checkbox from './components/Checkbox';
import Form from './components/Form';
import FormError from './components/FormErrorMessage';
import FormLabel from './components/FormLabel';
import Input from './components/Input';
import Menu from './components/Menu';
import Progress from './components/Progress';
import Radio from './components/Radio';
import Select from './components/Select';
import Skeleton from './components/Skeleton';
import Table from './components/Table';
import Tabs from './components/Tabs';
=======
=======
import colors from './foundations/colors';

>>>>>>> feat(chakra): add form control inputs styles
import Badge from './components/Badge';
import Button from './components/Button';
import Input from './components/Input';
>>>>>>> feat: separate tags and badges
import Tag from './components/Tag';
<<<<<<< HEAD
import Textarea from './components/Textarea';
import Tile from './components/Tile';

export default {
=======
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
>>>>>>> feat(chakra): add form control inputs styles
  colors,
  components: {
    Accordion,
    Alert,
    Badge,
    Breadcrumb,
    Button,
    Checkbox,
    Input,
    Form,
    FormError,
    FormLabel,
    Menu,
    Progress,
    Radio,
    Select,
    Skeleton,
    Table,
    Tabs,
    Tag,
<<<<<<< HEAD
    Textarea,
    Tile,
  },
  styles: {
    global: globalStyle,
=======
    Input,
    FormLabel,
    FormErrorMessage,
    Form,
    Badge,
>>>>>>> feat: separate tags and badges
  },
  radii,
  shadows,
};

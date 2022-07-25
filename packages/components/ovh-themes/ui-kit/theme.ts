<<<<<<< HEAD
<<<<<<< HEAD
import globalStyle from './foundations/global';
import colors from './foundations/colors';
import shadows from './foundations/shadows';
import radii from './foundations/radius';

<<<<<<< HEAD
import Accordion from './components/Accordion';
import Alert from './components/Alert';
import Badge from './components/Badge';
import Breadcrumb from './components/Breadcrumb';
import Button from './components/Button';
<<<<<<< HEAD
import Checkbox from './components/Checkbox';
import Form from './components/Form';
import FormError from './components/FormErrorMessage';
import FormLabel from './components/FormLabel';
=======
import Table from './components/Table';
>>>>>>> feat(chakra): add Table component style
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
=======
import Alert from './components/Alert';
>>>>>>> feat(chakra): add Alert component style
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
>>>>>>> feat(chakra): add form control inputs styles
  colors,
  components: {
<<<<<<< HEAD
    Accordion,
    Alert,
    Badge,
    Breadcrumb,
=======
    Alert,
>>>>>>> feat(chakra): add Alert component style
    Button,
    Checkbox,
<<<<<<< HEAD
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
=======
>>>>>>> feat(tabs): add tabs to chakra theme
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
    FormError,
    Form,
    Badge,
<<<<<<< HEAD
>>>>>>> feat: separate tags and badges
=======
    Table,
<<<<<<< HEAD
>>>>>>> feat(chakra): add Table component style
=======
    Tabs,
>>>>>>> feat(tabs): add tabs to chakra theme
  },
  radii,
  shadows,
};

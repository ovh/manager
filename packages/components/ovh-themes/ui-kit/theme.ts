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
import Tile from './components/Tile';
import Menu from './components/Menu';
import Radio from './components/Radio';
import Select from './components/Select';

export default {
  styles: {
    global: {
      '*': {
        fontFamily: 'Source Sans Pro',
        fontWeight: 400,
      },
      'h1, h2, h3, h4, h5, h6': {
        color: 'uikit.800',
        lineHeight: 1.5,
      },
      h1: {
        fontWeight: 300,
        fontSize: '7xl',
      },
      h2: {
        fontWeight: 300,
        fontSize: '5xl',
      },
      h3: {
        fontWeight: 400,
        fontSize: '4xl',
      },
      h4: {
        fontWeight: 400,
        fontSize: '1.75rem',
      },
      h5: {
        fontWeight: 700,
        fontSize: 'xl',
      },
      h6: {
        fontWeight: 700,
        fontSize: 'lg',
      },
      'button:focus-visible': {
        outlineColor: 'green !important',
        outlineStyle: 'dashed !important',
        outlineWidth: '2px !important',
      },
    },
  },
<<<<<<< HEAD
  shadows: {
    // This is none because it's not the real outline property
    // it's just a shadow on focus-visible.
    // Outline styles are overriden in global styles.
    outline: 'none',
  },
>>>>>>> feat(chakra): add form control inputs styles
=======
  shadows,
>>>>>>> feat(theme): add tile
  colors,
  radii,
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
<<<<<<< HEAD
>>>>>>> feat(tabs): add tabs to chakra theme
=======
    Tile,
<<<<<<< HEAD
>>>>>>> feat(theme): add tile
=======
    Menu,
<<<<<<< HEAD
>>>>>>> feat(chakra): add action menu component
=======
    Radio,
<<<<<<< HEAD
>>>>>>> feat(uikit): add radio buttons theme
=======
    Select,
>>>>>>> feat(theme): add select theme to chakra
  },
  radii,
  shadows,
};

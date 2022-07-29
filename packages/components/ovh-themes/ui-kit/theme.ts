import colors from './foundations/colors';
import shadows from './foundations/shadows';
import radii from './foundations/radius';

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
import Tag from './components/Tag';
import Textarea from './components/Textarea';
import Tile from './components/Tile';

export default {
  styles: {
    global: {
      body: {
        color: 'uikit.800-text',
        fontFamily: 'Source Sans Pro',
        letterSpacing: '0.12px',
      },
      a: {
        color: 'uikit.500',
        cursor: 'pointer',
        fontWeight: 600,
        _hover: {
          color: 'uikit.700',
          textDecoration: 'underline',
        },
      },
      'h1, h2, h3, h4, h5, h6': {
        color: 'uikit.800',
        lineHeight: 1.5,
      },
      h1: {
        fontSize: '7xl',
        fontWeight: 300,
      },
      h2: {
        fontSize: '5xl',
        fontWeight: 300,
      },
      h3: {
        fontSize: '4xl',
        fontWeight: 400,
      },
      h4: {
        fontSize: '1.75rem',
        fontWeight: 400,
      },
      h5: {
        fontSize: 'xl',
        fontWeight: 700,
      },
      h6: {
        fontSize: 'lg',
        fontWeight: 700,
      },
      'button:focus-visible, a:focus-visible': {
        outlineColor: 'green !important',
        outlineStyle: 'dashed !important',
        outlineWidth: '2px !important',
      },
    },
  },
  shadows,
  colors,
  radii,
  components: {
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
    Textarea,
    Tile,
  },
};

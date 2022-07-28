import colors from './foundations/colors';
import shadows from './foundations/shadows';
import radii from './foundations/radius';

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
import Tile from './components/Tile';
import Menu from './components/Menu';
import Radio from './components/Radio';
import Select from './components/Select';
import Textarea from './components/Textarea';

export default {
  styles: {
    global: {
      '*': {
        fontFamily: 'Source Sans Pro',
        letterSpacing: '0.12px',
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
    Tile,
    Menu,
    Radio,
    Select,
    Textarea,
  },
};

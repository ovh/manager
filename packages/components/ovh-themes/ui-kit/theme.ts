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
  },
};

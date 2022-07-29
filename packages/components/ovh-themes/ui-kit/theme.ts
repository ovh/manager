import globalStyle from './foundations/global';
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
  colors,
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
  styles: {
    global: globalStyle,
  },
  radii,
  shadows,
};

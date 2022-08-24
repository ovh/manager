import globalStyle from './foundations/global';
import colors from './foundations/colors';
import shadows from './foundations/shadows';
import radii from './foundations/radius';
import breakpoints from './foundations/breakpoints';

import Accordion from './components/Accordion';
import Alert from './components/Alert';
import Badge from './components/Badge';
import Breadcrumb from './components/Breadcrumb';
import Button from './components/Button';
import Calendar from './components/Calendar';
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
import ThumbnailChoice from './components/ThumbnailChoice';
import Tile from './components/Tile';
import Popover from './components/Popover';
import Modal from './components/Modal';

export default {
  colors,
  components: {
    Accordion,
    Alert,
    Badge,
    Breadcrumb,
    Button,
    Calendar,
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
    ThumbnailChoice,
    Tile,
    Popover,
    Modal,
  },
  breakpoints,
  radii,
  shadows,
  styles: {
    global: globalStyle,
  },
};

import { COMPONENT_BINDINGS } from '../partition.constants';

import controller from './zfs-options.controller';
import template from './zfs-options.template.html';

export default {
  bindings: { ...COMPONENT_BINDINGS },
  controller,
  template,
};

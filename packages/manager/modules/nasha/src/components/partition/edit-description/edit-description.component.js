import { COMPONENT_BINDINGS } from '../partition.constants';

import controller from './edit-description.controller';
import template from './edit-description.template.html';

export default {
  bindings: { ...COMPONENT_BINDINGS },
  controller,
  template,
};

import { COMPONENT_BINDINGS } from '../partition.constants';

import controller from './edit-name.controller';
import template from './edit-name.template.html';

export default {
  bindings: {
    ...COMPONENT_BINDINGS,
    partitionNames: '<',
  },
  controller,
  template,
};

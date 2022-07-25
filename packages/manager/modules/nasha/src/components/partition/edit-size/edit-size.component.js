import { COMPONENT_BINDINGS } from '../partition.constants';

import controller from './edit-size.controller';
import template from './edit-size.template.html';

export default {
  bindings: {
    ...COMPONENT_BINDINGS,
    taskApiUrl: '<',
  },
  controller,
  template,
};

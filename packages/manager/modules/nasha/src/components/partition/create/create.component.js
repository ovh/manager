import { COMPONENT_BINDINGS } from '../partition.constants';

import controller from './create.controller';
import template from './create.template.html';

export default {
  bindings: {
    ...COMPONENT_BINDINGS,
    nashaApiUrl: '<',
    partitionNames: '<',
    protocolEnum: '<',
  },
  controller,
  template,
};

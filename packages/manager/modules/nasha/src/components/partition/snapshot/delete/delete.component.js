import { COMPONENT_BINDINGS } from '../../partition.constants';

import controller from './delete.controller';
import template from './delete.template.html';

export default {
  bindings: {
    ...COMPONENT_BINDINGS,
    customSnapshotName: '<',
  },
  controller,
  template,
};

import { asBindings } from '@iam/resolves';

import controller from './resourceGroups.controller';
import resolves from './resourceGroups.resolves';
import template from './resourceGroups.template.html';

export default {
  bindings: {
    ...asBindings(resolves),
  },
  controller,
  template,
};

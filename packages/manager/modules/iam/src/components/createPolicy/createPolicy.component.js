import { asBindings } from '@iam/resolves';

import controller from './createPolicy.controller';
import resolves from './createPolicy.resolves';
import template from './createPolicy.template.html';

export default {
  bindings: {
    ...asBindings(resolves),
  },
  controller,
  template,
};

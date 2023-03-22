import { asBindings } from '@iam/resolves';

import controller from './resourceGroup.controller';
import resolves from './resourceGroup.resolves';
import template from './resourceGroup.template.html';

export default {
  bindings: {
    ...asBindings(resolves),
  },
  controller,
  template,
};

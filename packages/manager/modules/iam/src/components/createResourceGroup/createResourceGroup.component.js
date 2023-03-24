import { asBindings } from '@iam/resolves';

import controller from './createResourceGroup.controller';
import resolves from './createResourceGroup.resolves';
import template from './createResourceGroup.template.html';

export default {
  bindings: {
    ...asBindings(resolves),
  },
  controller,
  template,
};

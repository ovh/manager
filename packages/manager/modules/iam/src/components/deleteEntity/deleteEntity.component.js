import { asBindings } from '@iam/resolves';

import controller from './deleteEntity.controller';
import resolves from './deleteEntity.resolves';
import template from './deleteEntity.template.html';

export default {
  bindings: {
    ...asBindings(resolves),
  },
  controller,
  template,
};

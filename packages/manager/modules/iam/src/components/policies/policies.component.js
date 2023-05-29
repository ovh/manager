import { asBindings } from '../../resolves';

import controller from './policies.controller';
import resolves from './policies.resolves';
import template from './policies.template.html';

export default {
  bindings: {
    ...asBindings(resolves),
  },
  controller,
  template,
};

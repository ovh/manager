import { asBindings } from '../../resolves';

import resolves from './policy.resolves';
import template from './policy.template.html';

export default {
  bindings: {
    ...asBindings(resolves),
  },
  template,
};

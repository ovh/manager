import { asBindings } from '../../resolves';

import controller from './policyIdentities.controller';
import resolves from './policyIdentities.resolves';
import template from './policyIdentities.template.html';

export default {
  bindings: {
    ...asBindings(resolves),
  },
  controller,
  template,
};

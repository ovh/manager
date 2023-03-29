import { asBindings } from '@iam/resolves';

import resolves from './onboarding.resolves';
import template from './onboarding.template.html';

export default {
  bindings: {
    ...asBindings(resolves),
  },
  template,
};

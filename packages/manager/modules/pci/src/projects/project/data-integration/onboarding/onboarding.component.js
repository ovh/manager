import controller from './onboarding.controller';
import template from './onboarding.html';

import './onboarding.scss';

export default {
  controller,
  template,
  bindings: {
    goToCli: '<',
  },
};

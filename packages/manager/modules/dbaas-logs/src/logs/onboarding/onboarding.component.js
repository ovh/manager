import controller from './onboarding.controller';
import template from './onboarding.html';

export default {
  bindings: {
    me: '<',
    orderLink: '<',
  },
  controller,
  template,
};

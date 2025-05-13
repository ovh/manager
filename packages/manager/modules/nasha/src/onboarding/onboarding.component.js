import controller from './onboarding.controller';
import template from './onboarding.template.html';

export default {
  bindings: {
    goToOrder: '<',
    trackClick: '<',
  },
  controller,
  template,
};

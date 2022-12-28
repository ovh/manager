import controller from './onboarding.controller';
import template from './onboarding.template.html';

export default {
  bindings: {
    isByoipAvailable: '<',
    goToAgoraOrder: '<',
    goToByoipConfiguration: '<',
  },
  controller,
  template,
};

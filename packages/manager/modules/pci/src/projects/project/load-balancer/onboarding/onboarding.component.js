import controller from './onboarding.controller';
import template from './onboarding.html';

export default {
  bindings: {
    user: '<',
    getStateName: '<',
    goToRegion: '<',
  },
  controller,
  template,
};

import controller from './onboarding.controller';
import template from './onboarding.html';

export default {
  controller,
  template,
  bindings: {
    addBlockStorage: '<',
    getStateName: '<',
    goToRegion: '<',
  },
};

import controller from './onboarding.controller';
import template from './onboarding.html';

export default {
  controller,
  template,
  bindings: {
    addFailoverIp: '<',
    buyFailoverIp: '<',
    instances: '<',
    getStateName: '<',
    goToRegion: '<',
  },
};

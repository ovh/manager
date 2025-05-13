import controller from './onboarding.controller';
import template from './onboarding.html';

export default {
  controller,
  template,
  bindings: {
    addCloudArchive: '<',
    getStateName: '<',
    goToRegion: '<',
  },
};

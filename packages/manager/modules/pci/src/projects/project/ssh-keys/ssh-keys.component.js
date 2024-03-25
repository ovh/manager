import controller from './ssh-keys.controller';
import template from './ssh-keys.html';

export default {
  bindings: {
    guideUrl: '<',
    projectId: '<',
    isDiscoveryProject: '<',
    goToDiscoveryProjectActivationPage: '&',
    goToAddSshkey: '&',
  },
  controller,
  template,
};

import controller from './contacts.controller';
import template from './contacts.html';

export default {
  bindings: {
    guideUrl: '<',
    isDiscoveryProject: '<',
    goToDiscoveryProjectActivationPage: '&',
  },
  controller,
  template,
};

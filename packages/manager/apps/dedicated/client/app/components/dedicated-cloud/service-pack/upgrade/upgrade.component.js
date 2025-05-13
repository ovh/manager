import controller from './upgrade.controller';
import template from './upgrade.html';

export default {
  bindings: {
    backButtonText: '<',
    goBack: '<',
    isPremier: '<',
    serviceName: '<',
    steps: '<',
  },
  controller,
  name: 'ovhManagerPccServicePackUpgrade',
  template,
};

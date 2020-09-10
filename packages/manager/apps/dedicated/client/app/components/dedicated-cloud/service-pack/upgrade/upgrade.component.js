import controller from './upgrade.controller';
import template from './upgrade.html';

export default {
  bindings: {
    backButtonText: '<',
    goBack: '<',
    steps: '<',
  },
  controller,
  name: 'ovhManagerPccServicePackUpgrade',
  template,
};

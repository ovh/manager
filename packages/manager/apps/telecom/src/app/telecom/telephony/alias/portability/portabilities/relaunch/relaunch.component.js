import controller from './relaunch.controller';
import template from './relaunch.html';

export default {
  controller,
  template,
  bindings: {
    billingAccount: '<',
    portabilityId: '<',
    goBack: '<',
    changeRequired: '<',
  },
};

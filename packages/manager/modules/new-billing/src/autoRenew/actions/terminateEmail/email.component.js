import controller from './billing-autoRenew-terminateEmail.controller';
import template from './billing-autoRenew-terminateEmail.html';

export default {
  bindings: {
    email: '<',
    goBack: '<',
    isHosting: '<',
    terminateEmail: '<',
  },
  controller,
  template,
};

import controller from './billing-autoRenew-terminateEmail.controller';
import template from './billing-autoRenew-terminateEmail.html';

export default {
  bindings: {
    email: '<',
    goToAutorenew: '<',
    isHosting: '<',
    terminateEmail: '<',
  },
  controller,
  template,
};

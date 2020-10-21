import controller from './billing-autoRenew-terminatePrivateDatabase.controller';
import template from './billing-autoRenew-terminatePrivateDatabase.html';

export default {
  bindings: {
    goBack: '<',
    terminateHostingPrivateDatabase: '<',
  },
  controller,
  template,
};

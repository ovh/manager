import controller from './billing-autoRenew-terminateHostingWeb.controller';
import template from './billing-autoRenew-terminateHostingWeb.html';

export default {
  bindings: {
    goBack: '<',
    terminateHosting: '<',
  },
  controller,
  template,
};

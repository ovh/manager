import controller from './disclaimer.controller';
import template from './disclaimer.html';

export default {
  bindings: {
    goBack: '<',
    goToExpressOrder: '<',
    byoip: '<',
    plan: '<',
  },
  controller,
  name: 'ipByoipDisclaimerComponent',
  template,
};

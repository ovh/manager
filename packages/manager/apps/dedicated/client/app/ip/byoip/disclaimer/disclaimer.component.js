import controller from './disclaimer.controller';
import template from './disclaimer.html';

export default {
  bindings: {
    expressOrderUrl: '<',
    goBack: '<',
    goToExpressOrder: '<',
  },
  name: 'ipByoipDisclaimerComponent',
  controller,
  template,
};

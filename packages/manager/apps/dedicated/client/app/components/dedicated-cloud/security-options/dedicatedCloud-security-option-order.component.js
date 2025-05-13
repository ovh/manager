import controller from './dedicatedCloud-security-option-order.controller';
import template from './dedicatedCloud-security-option-order.html';

export default {
  template,
  controller,
  bindings: {
    goBack: '<',
    optionName: '<',
    productId: '<',
    setMessage: '<',
  },
  name: 'ovhManagerPccSecurityOptions',
};

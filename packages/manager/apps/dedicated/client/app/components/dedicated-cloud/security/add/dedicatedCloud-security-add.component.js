import controller from './dedicatedCloud-security-add.controller';
import template from './dedicatedCloud-security-add.html';

export default {
  template,
  controller,
  bindings: {
    goBack: '<',
    productId: '<',
  },
  name: 'ovhManagerPccSecurityAdd',
};

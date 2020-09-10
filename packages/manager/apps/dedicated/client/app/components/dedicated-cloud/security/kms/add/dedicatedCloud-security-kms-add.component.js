import controller from './dedicatedCloud-security-kms-add.controller';
import template from './dedicatedCloud-security-kms-add.html';

export default {
  template,
  controller,
  bindings: {
    goBack: '<',
    productId: '<',
  },
  name: 'ovhManagerPccSecurityKmsAdd',
};

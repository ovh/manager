import controller from './dedicatedCloud-security-kms-edit.controller';
import template from './dedicatedCloud-security-kms-edit.html';

export default {
  template,
  controller,
  bindings: {
    goBack: '<',
    kmsToEdit: '<',
    productId: '<',
  },
  name: 'ovhManagerPccSecurityKmsEdit',
};

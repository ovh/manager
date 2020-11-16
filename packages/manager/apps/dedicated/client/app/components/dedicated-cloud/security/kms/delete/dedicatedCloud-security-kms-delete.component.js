import controller from './dedicatedCloud-security-kms-delete.controller';
import template from './dedicatedCloud-security-kms-delete.html';

export default {
  template,
  controller,
  bindings: {
    goBack: '<',
    kmsToDelete: '<',
    productId: '<',
  },
  name: 'ovhManagerPccSecurityKmsDelete',
};

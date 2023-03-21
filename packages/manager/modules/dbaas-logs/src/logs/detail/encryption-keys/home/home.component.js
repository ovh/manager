import controller from './logs-encryption-keys-home.controller';
import template from './logs-encryption-keys-home.html';

export default {
  controller,
  template,
  bindings: {
    encryptionKeys: '<',
    goToHomePage: '<',
    goToAddPage: '<',
    serviceName: '<',
  },
};

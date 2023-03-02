import controller from './logs-encryption-keys-add.controller';
import template from './logs-encryption-keys-add.html';

export default {
  controller,
  template,
  bindings: {
    goToEncryptionKeysHomePage: '<',
    serviceName: '<',
  },
};

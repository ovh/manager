import controller from './password-backup-storage.controller';
import template from './password-backup-storage.html';

export default {
  bindings: {
    goBack: '<',
    serviceName: '<',
  },
  controller,
  template,
};

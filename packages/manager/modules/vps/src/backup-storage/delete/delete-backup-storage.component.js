import controller from './delete-backup-storage.controller';
import template from './delete-backup-storage.html';

export default {
  bindings: {
    access: '<',
    goBack: '<',
    serviceName: '<',
  },
  controller,
  template,
};

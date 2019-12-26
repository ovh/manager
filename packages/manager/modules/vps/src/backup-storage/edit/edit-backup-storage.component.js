import controller from './edit-backup-storage.controller';
import template from './edit-backup-storage.html';

export default {
  bindings: {
    row: '<',
    goBack: '<',
    serviceName: '<',
  },
  controller,
  template,
};

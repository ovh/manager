import controller from './add-backup-storage.controller';
import template from './add-backup-storage.html';

export default {
  bindings: {
    goBack: '<',
    serviceName: '<',
  },
  controller,
  template,
};

import controller from './vps-backup-storage.controller';
import template from './vps-backup-storage.html';

export default {
  bindings: {
    goToAddBackupStorage: '<',
    goToDeleteBackupStorage: '<',
    goToEditBackupStorage: '<',
    goToPassword: '<',
    serviceName: '<',
    tabSummary: '<',
  },
  controller,
  name: 'ovhManagerVpsBackupStorage',
  template,
};

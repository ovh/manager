import template from './backups.html';
import controller from './backups.controller';

export default {
  bindings: {
    backupList: '<',
    backupPrice: '<',
    clusterDetails: '<',
    defaultPaymentMethod: '<',
    getBackupDetails: '<',
    goToDeleteBackup: '<',
    goToManualBackup: '<',
    goToRecovery: '<',
    goToRestore: '<',
    refreshBackups: '<',
    restorePrice: '<',
    user: '<',
  },
  controller,
  template,
};

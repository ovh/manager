import controller from './manual-backup.controller';
import template from './manual-backup.html';

const component = {
  bindings: {
    backupPrice: '<',
    clusterId: '<',
    defaultPaymentMethod: '<',
    goBackToBackups: '<',
    user: '<',
  },
  controller,
  template,
};

export default component;

import controller from './restore.controller';
import template from './restore.html';

const component = {
  bindings: {
    backupInstance: '<',
    defaultPaymentMethod: '<',
    goBackToBackups: '<',
    restorePrice: '<',
    user: '<',
  },
  controller,
  template,
};

export default component;

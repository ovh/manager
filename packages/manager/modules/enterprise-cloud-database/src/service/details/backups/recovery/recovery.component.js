import controller from './recovery.controller';
import template from './recovery.html';

const component = {
  bindings: {
    clusterId: '<',
    defaultPaymentMethod: '<',
    goBackToBackups: '<',
    minDate: '<',
    restorePrice: '<',
    user: '<',
  },
  controller,
  template,
};

export default component;

import controller from './controller';
import template from './index.html';

export default {
  name: 'pciProjectNewConfig',
  controller,
  template,
  bindings: {
    cart: '<',
    getActionHref: '<',
    goToPayment: '<',
    hds: '<',
    model: '<',
    summary: '<',
    getSummary: '<',
    trackClick: '<',
  },
};

import controller from './veeam-dashboard.controller';
import template from './veeam-dashboard.html';

export default {
  controller,
  template,
  bindings: {
    goToStorageAdd: '<',
    goToOfferChange: '<',
  },
};

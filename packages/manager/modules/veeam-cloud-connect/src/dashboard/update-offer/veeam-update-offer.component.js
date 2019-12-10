import controller from './veeam-update-offer.controller';
import template from './veeam-update-offer.html';

export default {
  controller,
  template,
  bindings: {
    serviceName: '<',
    goToDashboard: '<',
  },
};

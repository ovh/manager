import controller from './migration-warning.controller';
import template from './template.html';

export default {
  bindings: {
    goToIncident: '<',
    goToContracts: '<',
    servicesIds: '<',
    trackingPrefix: '<',
  },
  controller,
  template,
};

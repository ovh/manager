import template from './template.html';

export default {
  bindings: {
    loadbalancer: '<',
    flavor: '<',
    network: '<',
    subnet: '<',
    goToEditName: '<',
    operatingStatusBadges: '<',
    provisioningStatusBadges: '<',
  },
  template,
};

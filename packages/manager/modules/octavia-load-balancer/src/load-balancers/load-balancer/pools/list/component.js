import template from './template.html';

export default {
  bindings: {
    pools: '<',
    goToPoolCreation: '<',
    getPoolDetailLink: '<',
    goToPoolEdition: '<',
    goToPoolDeletion: '<',
    operatingStatusBadges: '<',
    provisioningStatusBadges: '<',
  },
  template,
};

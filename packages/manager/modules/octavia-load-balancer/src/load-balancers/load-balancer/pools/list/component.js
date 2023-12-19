import template from './template.html';

export default {
  bindings: {
    pools: '<',
    goToPoolCreation: '<',
    getPoolDetailLink: '<',
    goToPoolEdition: '<',
    goToPoolDeletion: '<',
    goToPoolMembers: '<',
    operatingStatusBadges: '<',
    provisioningStatusBadges: '<',
  },
  template,
};

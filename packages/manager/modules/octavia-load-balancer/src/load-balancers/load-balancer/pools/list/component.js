import template from './template.html';

export default {
  bindings: {
    pools: '<',
    goToPoolCreation: '<',
    getPoolDetailLink: '<',
    goToPoolEditionFromList: '<',
    goToPoolDeletion: '<',
    goToPoolMembers: '<',
    operatingStatusBadges: '<',
    provisioningStatusBadges: '<',
  },
  template,
};

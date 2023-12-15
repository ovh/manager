import template from './template.html';

export default {
  bindings: {
    pool: '<',
    listener: '<',
    goToPoolEdition: '<',
    goToEditName: '<',
    goToAddMemberManually: '<',
    goToAddMemberFromInstances: '<',
    goToDelete: '<',
    operatingStatusBadges: '<',
    provisioningStatusBadges: '<',
  },
  template,
};

import template from './template.html';

export default {
  bindings: {
    pool: '<',
    listener: '<',
    goToPoolEditionFromOverview: '<',
    goToEditName: '<',
    goToAddMemberManually: '<',
    goToAddMemberFromInstances: '<',
    goToDelete: '<',
    operatingStatusBadges: '<',
    provisioningStatusBadges: '<',
  },
  template,
};

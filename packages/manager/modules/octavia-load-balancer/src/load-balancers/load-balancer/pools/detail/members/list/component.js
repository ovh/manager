import template from './template.html';

export default {
  bindings: {
    members: '<',
    memberAddLink: '<',
    trackMemberAddAction: '<',
    memberAddInstanceLink: '<',
    trackMemberAddInstanceAction: '<',
    goToMemberDeletion: '<',
    goToMemberEdition: '<',
    operatingStatusBadges: '<',
    provisioningStatusBadges: '<',
  },
  template,
};

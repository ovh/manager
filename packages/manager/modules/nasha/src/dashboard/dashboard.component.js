import controller from './dashboard.controller';
import template from './dashboard.template.html';

export default {
  bindings: {
    alertError: '<',
    canCreatePartitions: '<',
    currentHref: '<',
    dashboardHref: '<',
    editNameHref: '<',
    goToEditName: '<',
    goToPartitionsCreate: '<',
    isCommitmentAvailable: '<',
    nasha: '<',
    nashaApiUrl: '<',
    numberOfPartitions: '<',
    reload: '<',
    serviceInfo: '<',
    serviceName: '<',
    trackClick: '<',
  },
  controller,
  template,
};

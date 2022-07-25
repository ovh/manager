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
    nasha: '<',
    nashaApiUrl: '<',
    numberOfPartitions: '<',
    reload: '<',
    serviceInfo: '<',
    serviceName: '<',
    user: '<',
  },
  controller,
  template,
};

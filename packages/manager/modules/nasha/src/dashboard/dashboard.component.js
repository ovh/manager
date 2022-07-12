import controller from './dashboard.controller';
import template from './dashboard.template.html';

export default {
  bindings: {
    alertError: '<',
    currentHref: '<',
    dashboardHref: '<',
    editNameHref: '<',
    goToEditName: '<',
    goToPartitionsCreate: '<',
    nasha: '<',
    nashaApiUrl: '<',
    reload: '<',
    serviceInfo: '<',
    serviceName: '<',
    user: '<',
  },
  controller,
  template,
};

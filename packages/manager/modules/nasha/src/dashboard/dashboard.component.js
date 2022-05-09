import controller from './dashboard.controller';
import template from './dashboard.template.html';

export default {
  bindings: {
    alertError: '<',
    currentHref: '<',
    dashboardHref: '<',
    editNameHref: '<',
    goToEditName: '<',
    goToPartitions: '<',
    nasha: '<',
    reload: '<',
    serviceInfo: '<',
    serviceName: '<',
    user: '<',
  },
  controller,
  template,
};

import controller from './logs-dashboard-header.controller';
import template from './logs-dashboard-header.html';

export default {
  bindings: {
    service: '<',
    serviceName: '<',
    isAccountDisabled: '<',
    accountSetupRequired: '<',
    trackClick: '<',
  },
  controller,
  controllerAs: 'ctrl',
  template,
};

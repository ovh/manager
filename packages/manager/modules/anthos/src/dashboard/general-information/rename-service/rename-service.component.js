import template from './rename-service.html';
import controller from './rename-service.controller';

export default {
  bindings: {
    tenant: '<',
    goBack: '<',
    goToTenant: '<',
    trackTenants: '<',
  },
  controller,
  template,
};

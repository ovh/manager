import controller from './service-keys.controller';
import template from './template.html';

export default {
  bindings: {
    cloudConnect: '<',
    cloudConnectId: '<',
    goToRegenerateServiceKeyPage: '<',
    goToServiceKeysPage: '<',
  },
  controller,
  template,
};

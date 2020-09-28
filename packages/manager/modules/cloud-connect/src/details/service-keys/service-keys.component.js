import controller from './service-keys.controller';
import template from './template.html';

export default {
  bindings: {
    cloudConnect: '<',
    goToRegenerateServiceKeyPage: '<',
    goToServiceKeysPage: '<',
  },
  controller,
  template,
};

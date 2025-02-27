import controller from './api-keys.controller';
import template from './api-keys.template.html';

export default {
  bindings: {
    apiKeys: '<',
    alert: '<',
    goTo: '<',
    trackClick: '<',
  },
  controller,
  template,
  name: 'iamApiKeys',
};

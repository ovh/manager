import controller from './iplb-frontends-preview.controller';
import template from './iplb-frontends-preview.html';

export default {
  bindings: {
    frontend: '<',
    goBack: '<',
    serviceName: '<',
  },
  controller,
  template,
};

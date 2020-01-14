import controller from './iplb-frontends-delete.controller';
import template from './iplb-frontends-delete.html';

export default {
  bindings: {
    frontend: '<',
    goBack: '<',
    serviceName: '<',
  },
  controller,
  template,
};

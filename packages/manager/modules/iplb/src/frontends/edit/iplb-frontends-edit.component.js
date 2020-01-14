import controller from './iplb-frontends-edit.controller';
import template from './iplb-frontends-edit.html';

export default {
  bindings: {
    frontendId: '<',
    goBack: '<',
    serviceName: '<',
  },
  controller,
  template,
};

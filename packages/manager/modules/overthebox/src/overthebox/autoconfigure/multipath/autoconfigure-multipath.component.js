import controller from './autoconfigure-multipath.controller';
import template from './template.html';

export default {
  controller,
  template,
  bindings: {
    serviceName: '<',
  },
};

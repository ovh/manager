import controller from './modem-acsBackend.controller';
import template from './modem-acsBackend.html';

export default {
  controller,
  template,
  bindings: {
    serviceName: '<',
  },
};

import controller from './pack-xdsl-modem.controller';
import template from './pack-xdsl-modem.html';

export default {
  controller,
  template,
  bindings: {
    serviceName: '<',
    number: '<',
  },
};

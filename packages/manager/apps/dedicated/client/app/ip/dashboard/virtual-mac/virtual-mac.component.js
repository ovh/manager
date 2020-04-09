import controller from './virtual-mac.controller';
import template from './virtual-mac.html';

export default {
  bindings: {
    goBack: '<',
    ip: '<',
    ipBlock: '<',
    serviceName: '<',
  },
  controller,
  template,
};

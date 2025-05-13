import template from './terminate.html';
import controller from './terminate.controller';

export default {
  template,
  controller,
  bindings: {
    serviceName: '<',
    serviceInfo: '<',
    vps: '<',
    goBack: '<',
    vpsOption: '<',
  },
};

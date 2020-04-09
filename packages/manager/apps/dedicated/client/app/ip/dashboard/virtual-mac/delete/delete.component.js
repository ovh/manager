import controller from './delete.controller';
import template from './delete.html';

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

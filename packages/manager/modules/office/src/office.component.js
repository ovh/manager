import template from './office.html';
import controller from './office.controller';

export default {
  controller,
  template,
  bindings: {
    resources: '<',
    gotoOrder: '<',
    getServiceNameLink: '<',
  },
};

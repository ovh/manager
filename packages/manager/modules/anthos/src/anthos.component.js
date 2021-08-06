import template from './anthos.html';
import controller from './anthos.controller';

export default {
  template,
  controller,
  bindings: {
    user: '<',
    tenants: '<',
    getServiceNameLink: '<',
  },
};

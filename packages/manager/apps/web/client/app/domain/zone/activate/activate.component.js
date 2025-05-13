import controller from './activate.controller';
import template from './activate.html';

export default {
  bindings: {
    goBack: '<',
    serviceName: '<',
    serviceOption: '<',
    user: '<',
  },
  controller,
  template,
};

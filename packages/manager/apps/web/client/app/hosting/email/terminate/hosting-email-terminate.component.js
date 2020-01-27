import controller from './hosting-email-terminate.controller';
import template from './hosting-email-terminate.html';

export default {
  controller,
  template,
  bindings: {
    goBack: '<',
    serviceName: '<',
  },
};

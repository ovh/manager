import controller from './smppParameter.controller';
import template from './smppParameter.html';

export default {
  bindings: {
    goToOptions: '<',
    serviceName: '<',
    isSmppAccount: '<',
  },
  controller,
  template,
};

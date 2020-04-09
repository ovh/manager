import controller from './confirm-terminate.controller';
import template from './confirm-terminate.html';

export default {
  bindings: {
    domainName: '<',
    goBack: '<',
  },
  controller,
  template,
};

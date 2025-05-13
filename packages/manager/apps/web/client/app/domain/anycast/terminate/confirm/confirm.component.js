import controller from './confirm.controller';
import template from './confirm.html';

export default {
  bindings: {
    domainName: '<',
    goBack: '<',
    setError: '<',
  },
  controller,
  template,
};

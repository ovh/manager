import controller from './activate.controller';
import template from './activate.html';

export default {
  bindings: {
    domainName: '<',
    goBack: '<',
    user: '<',
  },
  controller,
  template,
};

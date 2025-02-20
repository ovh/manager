import template from './sso.template.html';
import controller from './sso.controller';

export default {
  controller,
  template,
  bindings: {
    goToSSODetails: '<',
  },
};

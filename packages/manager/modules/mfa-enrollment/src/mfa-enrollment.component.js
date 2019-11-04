import controller from './mfa-enrollment.controller';
import template from './mfa-enrollment.html';

export default {
  bindings: {
    from: '<',
    rootState: '<',
  },
  controller,
  template,
};

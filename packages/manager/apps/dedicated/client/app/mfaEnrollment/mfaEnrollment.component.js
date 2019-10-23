import controller from './mfaEnrollment.controller';
import template from './mfaEnrollment.html';

export default {
  bindings: {
    forced: '<',
    from: '<',
    rootState: '<',
  },
  controller,
  template,
};

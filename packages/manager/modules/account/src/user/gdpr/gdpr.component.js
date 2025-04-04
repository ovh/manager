import controller from './gdpr.controller';
import template from './gdpr.html';

export default {
  bindings: {
    canCreateErasureRequest: '<',
  },
  controller,
  template,
};

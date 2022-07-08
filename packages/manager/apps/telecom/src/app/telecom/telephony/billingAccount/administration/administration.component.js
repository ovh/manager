import template from './administration.html';
import controller from './administration.controller';

export default {
  controller,
  template,
  bindings: {
    canResetWhiteLabelManagerPassword: '<',
  },
};

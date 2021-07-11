import template from './template.html';
import controller from './welcome.controller';

export default {
  controller,
  bindings: {
    isTrusted: '<',
  },
  template,
};

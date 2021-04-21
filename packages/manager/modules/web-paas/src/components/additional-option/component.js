import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    option: '<',
    plan: '<',
  },
  controller,
  template,
};

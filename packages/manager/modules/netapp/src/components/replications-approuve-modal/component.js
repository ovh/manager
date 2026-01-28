import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    goToReplications: '<',
    params: '<',
  },
  controller,
  template,
};

import controller from './assign-tags.controller';
import template from './assign-tags.template.html';

export default {
  bindings: {
    goBack: '<',
    server: '<',
  },
  controller,
  template,
};

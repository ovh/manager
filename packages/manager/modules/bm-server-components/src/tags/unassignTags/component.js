import controller from './un-assign-tags.controller';
import template from './un-assign-tags.template.html';

export default {
  bindings: {
    goBack: '<',
    server: '<',
  },
  controller,
  template,
};

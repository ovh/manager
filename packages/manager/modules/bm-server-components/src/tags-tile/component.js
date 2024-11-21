import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    server: '<',
    goToTags: '&',
  },
  controller,
  template,
};

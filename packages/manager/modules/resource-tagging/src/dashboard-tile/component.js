import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    tags: '<',
    goToTagManager: '<',
    goToTagsModal: '<',
  },
  controller,
  template,
};

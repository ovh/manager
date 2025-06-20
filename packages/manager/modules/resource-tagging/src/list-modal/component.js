import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    resourceName: '<',
    tags: '<',
    goToTagManager: '<',
    cancel: '<',
  },
  controller,
  template,
};

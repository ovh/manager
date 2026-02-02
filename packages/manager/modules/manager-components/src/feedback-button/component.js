import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    applicationKey: '@',
    chapters: '<',
  },
  template,
  controller,
};

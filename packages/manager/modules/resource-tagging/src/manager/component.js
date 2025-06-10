import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    tags: '<',
    goBack: '<',
    goToTagAssign: '<',
    goToTagUnassign: '<',
  },
  template,
  controller,
};

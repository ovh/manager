import controller from './edit-description.controller';
import template from './template.html';

export default {
  bindings: {
    description: '<',
    goBack: '<',
  },
  controller,
  template,
};

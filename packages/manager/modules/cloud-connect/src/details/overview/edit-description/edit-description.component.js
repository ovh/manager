import controller from './edit-description.controller';
import template from './template.html';

export default {
  bindings: {
    cloudConnect: '<',
    description: '<',
    goBack: '<',
  },
  controller,
  template,
};

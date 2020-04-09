import controller from './add-or-edit.controller';
import template from './add-or-edit.html';

export default {
  bindings: {
    goBack: '<',
    organisation: '<',
  },
  controller,
  template,
};

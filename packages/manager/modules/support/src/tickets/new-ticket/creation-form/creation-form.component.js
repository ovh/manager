import controller from './creation-form.controller';
import template from './creation-form.html';

export default {
  bindings: {
    issues: '<',
    onSubmit: '&',
  },
  controller,
  name: 'supportNewCreationForm',
  template,
};

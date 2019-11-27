import controller from './creation-form.controller';
import template from './creation-form.html';

export default {
  bindings: {
    issue: '<',
    onSubmit: '&',
    goBack: '&',
  },
  controller,
  name: 'supportNewCreationForm',
  template,
};

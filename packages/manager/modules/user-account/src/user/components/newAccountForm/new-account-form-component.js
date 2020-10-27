import controller from './new-account-form-component.controller';
import template from './new-account-form-component.html';

export default {
  bindings: {
    model: '<',
    readonly: '<',
    onSubmit: '&', // on create callback
    onCancel: '&', // on cancel callback
  },
  controller,
  template,
};

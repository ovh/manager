import controller from './modal-form.controller';
import template from './modal-form.template.html';

export default {
  bindings: {
    canSubmit: '=',
    close: '&',
    loading: '=',
    heading: '@',
    primaryLabel: '@',
    secondaryLabel: '@',
    submit: '&',
    type: '@',
  },
  controller,
  template,
  transclude: true,
};

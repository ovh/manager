import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    model: '=',
    submitLabel: '@?',
    onSubmit: '&',
    onCancel: '&',
  },
  controller,
  template,
};

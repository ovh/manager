import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    associatedPool: '<',
    model: '=',
    onSubmit: '&?',
    submitLabel: '@?',
    onCancel: '&?',
  },
  controller,
  template,
};

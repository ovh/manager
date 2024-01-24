import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    model: '=',
    redirectHttpCodes: '<',
    pools: '<',
    submitLabel: '@?',
    onSubmit: '&',
    onCancel: '&',
  },
  controller,
  template,
};

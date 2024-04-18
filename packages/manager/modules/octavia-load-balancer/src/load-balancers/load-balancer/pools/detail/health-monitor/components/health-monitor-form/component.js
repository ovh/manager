import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    associatedPool: '<',
    model: '=',
    editionMode: '<?',
    onSubmit: '&?',
    submitLabel: '@?',
    onCancel: '&?',
  },
  controller,
  template,
};

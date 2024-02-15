import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    model: '=',
    pools: '<',
    isEditing: '<?',
    onSubmit: '&',
    onCancel: '&',
  },
  controller,
  template,
};

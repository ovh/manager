import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    model: '=',
    algorithms: '<',
    protocols: '<',
    sessionPersistenceTypes: '<',
    isEditing: '<?',
    onSubmit: '&',
    onCancel: '&',
  },
  controller,
  template,
};

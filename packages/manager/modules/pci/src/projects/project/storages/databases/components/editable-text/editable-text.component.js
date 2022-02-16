import controller from './editable-text.controller';
import template from './editable-text.html';

export default {
  bindings: {
    value: '=',
    min: '<?',
    max: '<?',
    pattern: '<?',
    pending: '<?',
    onChange: '&',
  },
  controller,
  template,
};

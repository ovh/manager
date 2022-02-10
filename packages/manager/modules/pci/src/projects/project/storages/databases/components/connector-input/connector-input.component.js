import controller from './connector-input.controller';
import template from './connector-input.html';

export default {
  bindings: {
    data: '<',
    model: '=',
    // label: '@',
    // min: '<?',
    // max: '<?',
    // pattern: '<?',
    // placeholder: '@',
    // buttonLabel: '@',
  },
  controller,
  template,
};

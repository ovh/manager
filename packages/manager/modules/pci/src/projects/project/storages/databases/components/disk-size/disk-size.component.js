import controller from './disk-size.controller';
import template from './disk-size.html';

export default {
  bindings: {
    flavor: '<',
    step: '<',
    model: '=',
    onChange: '&?',
    initialValue: '<?',
  },
  controller,
  template,
};

import controller from './password.controller';
import template from './password.html';

export default {
  bindings: {
    confirm: '<?',
    password: '=',
  },
  controller,
  template,
};

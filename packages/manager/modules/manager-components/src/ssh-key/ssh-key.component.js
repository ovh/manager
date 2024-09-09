import controller from './ssh-key.controller';
import template from './ssh-key.template.html';

export default {
  bindings: {
    required: '<?',
    publicKey: '=?',
  },
  controller,
  template,
};

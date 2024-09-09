import controller from './ssh-key.controller';
import template from './ssh-key.template.html';

export default {
  bindings: {
    publicKey: '=?',
    required: '<?',
    rows: '<?',
    name: '<?',
    placeholder: '@?',
  },
  controller,
  template,
};

import controller from './ssh-key-selector.controller';
import template from './ssh-key-selector.template.html';

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

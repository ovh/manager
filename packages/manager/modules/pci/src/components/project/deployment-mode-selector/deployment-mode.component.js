import controller from './deployment-mode.controller';
import template from './deployment-mode.html';

export default {
  controller,
  template,
  bindings: {
    onChange: '&?',
    prices: '<?',
  },
};

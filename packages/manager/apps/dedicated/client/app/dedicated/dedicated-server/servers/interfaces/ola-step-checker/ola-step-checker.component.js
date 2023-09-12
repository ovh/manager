import controller from './ola-step-checker.controller';
import template from './ola-step-checker.html';

export default {
  controller,
  template,
  bindings: {
    guide: '<',
    price: '<',
    ola: '<',
    user: '<',
  },
};

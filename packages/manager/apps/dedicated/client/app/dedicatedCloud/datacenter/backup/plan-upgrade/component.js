import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    onChange: '&',
    plans: '<',
    user: '<',
  },
  controller,
  template,
};

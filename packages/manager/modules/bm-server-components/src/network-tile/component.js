import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    server: '<',
    bandwidth: '<',
    onError: '&?',
  },
  controller,
  template,
  transclude: true,
};

import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    server: '<',
    bandwidth: '<',
    onError: '&?',
    trackingPrefix: '<',
  },
  controller,
  template,
  transclude: true,
};

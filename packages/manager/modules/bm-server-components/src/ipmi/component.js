import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    user: '<',
    server: '<',
    onIpmiRestart: '&?',
    onKvmOrder: '&?',
    onError: '&?',
    onSuccess: '&?',
  },
  controller,
  template,
  transclude: true,
};

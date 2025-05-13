import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    user: '<',
    server: '<',
    trackingPrefix: '<',
    onIpmiRestart: '&?',
    onKvmOrder: '&?',
    onError: '&?',
    onSuccess: '&?',
  },
  controller,
  template,
  transclude: true,
};

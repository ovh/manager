import controller from './commitment.controller';
import template from './commitment.html';

export default {
  bindings: {
    callbackUrl: '<',
    goBack: '<',
    serviceId: '<',
    duration: '<?',
    me: '<',
    trackingPrefix: '@?',
  },
  controller,
  template,
};

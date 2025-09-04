import controller from './commitment.controller';
import template from './commitment.html';
import './commitment.scss';

export default {
  bindings: {
    callbackUrl: '<',
    goBack: '<',
    serviceId: '<',
    duration: '<?',
    me: '<',
    trackingPrefix: '@?',
    pageTrackingPrefix: '@?',
  },
  controller,
  template,
};

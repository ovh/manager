import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    goBack: '<',
    trackingPrefix: '<',
    trackClick: '<',
    trackPage: '<',
    orderPublicIpHitTracking: '<',
  },
  controller,
  template,
};

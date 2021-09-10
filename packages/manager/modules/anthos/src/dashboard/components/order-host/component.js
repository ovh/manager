import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    goBack: '<',
    trackingPrefix: '<',
    trackClick: '<',
    trackPage: '<',
    orderHostHitTracking: '<',
  },
  template,
  controller,
};

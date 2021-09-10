import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    serviceName: '<',
    goBack: '<',
    hostService: '<',
    trackPage: '<',
    trackClick: '<',
    removeHostHitTracking: '<',
  },
  controller,
  template,
};

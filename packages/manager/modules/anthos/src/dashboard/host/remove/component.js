import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    serviceName: '<',
    goBack: '<',
    hostService: '<',
    trackClick: '<',
    removeHostHitTracking: '<',
  },
  controller,
  template,
};

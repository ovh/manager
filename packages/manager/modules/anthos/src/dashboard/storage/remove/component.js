import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    serviceName: '<',
    goBack: '<',
    storage: '<',
    trackClick: '<',
    trackPage: '<',
    removeStorageHitTracking: '<',
  },
  controller,
  template,
};

import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    serviceName: '<',
    goBack: '<',
    host: '<',
    trackPage: '<',
    trackClick: '<',
    setStateHitTracking: '<',
  },
  controller,
  template,
};

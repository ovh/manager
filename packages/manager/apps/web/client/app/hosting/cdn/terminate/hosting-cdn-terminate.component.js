import controller from './hosting-cdn-terminate.controller';
import template from './hosting-cdn-terminate.html';

export default {
  controller,
  template,
  bindings: {
    serviceName: '<',
    alerts: '<',
    goBack: '<',
    trackClick: '<',
  },
};

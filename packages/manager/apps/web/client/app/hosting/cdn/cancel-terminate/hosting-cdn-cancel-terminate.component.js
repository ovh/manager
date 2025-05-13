import controller from './hosting-cdn-cancel-terminate.controller';
import template from './hosting-cdn-cancel-terminate.html';

export default {
  controller,
  template,
  bindings: {
    serviceName: '<',
    alerts: '<',
    cdnServiceInfo: '<',
    goBack: '<',
    trackClick: '<',
  },
};

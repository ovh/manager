import controller from './dedicatedCloud-terminate.controller';
import template from './dedicatedCloud-terminate.html';

export default {
  bindings: {
    canDeleteAtExpiration: '<',
    goBack: '<',
    trackingPrefix: '<',
    serviceInfos: '<',
    serviceName: '<',
  },
  controller,
  template,
};

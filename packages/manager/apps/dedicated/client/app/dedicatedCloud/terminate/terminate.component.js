import controller from './dedicatedCloud-terminate.controller';
import template from './dedicatedCloud-terminate.html';

export default {
  bindings: {
    serviceInfos: '<',
    canDeleteAtExpiration: '<',
    serviceName: '<',
  },
  controller,
  template,
};

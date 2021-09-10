import template from './service-expiration-date.component.html';
import controller from './service-expiration-date.component.controller';

export default {
  template,
  controller,
  bindings: {
    serviceInfos: '<',
    hideRenewAction: '<',
    forceHideRenewAction: '<',
    hideRenewDate: '<',
    serviceType: '<',
    serviceName: '<',
    inline: '<',
  },
};

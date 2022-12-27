import template from './service-expiration-date.component.html';

export default {
  template,
  bindings: {
    serviceInfos: '<',
    hideRenewAction: '<',
    serviceType: '@',
    serviceName: '<',
    domainState: '<',
  },
  controller: 'WucServiceExpirationDateComponentCtrl',
};

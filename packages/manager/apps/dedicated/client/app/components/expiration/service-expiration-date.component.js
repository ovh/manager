(() => {
  angular.module('directives').component('serviceExpirationDate', {
    templateUrl: 'components/expiration/service-expiration-date.component.html',
    bindings: {
      serviceInfos: '<',
      hideRenewAction: '<',
      forceHideRenewAction: '<',
      hideRenewDate: '<',
      serviceType: '<',
      serviceName: '<',
      inline: '<',
    },
    controller: 'ServiceExpirationDateComponentCtrl',
  });
})();

(() => {
  angular.module('directives').component('serviceExpirationLabel', {
    templateUrl:
      'components/expiration/service-expiration-label.component.html',
    bindings: {
      serviceInfos: '<',
    },
    controller: 'ServiceExpirationLabelComponentCtrl',
  });
})();

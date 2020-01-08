angular.module('App').config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.dedicatedClouds.license.enable', {
      controller: 'ovhManagerPccLicenseEnable',
      controllerAs: '$ctrl',
      layout: 'modal',
      templateUrl:
        'dedicatedCloud/license/enable/dedicatedCloud-license-enable.html',
      url: '/enable',
    });
  },
);

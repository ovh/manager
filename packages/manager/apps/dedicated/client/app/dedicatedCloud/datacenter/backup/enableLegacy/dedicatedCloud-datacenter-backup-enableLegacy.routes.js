angular.module('App').config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.dedicatedClouds.datacenter.backup.enableLegacy', {
      url: '/enableLegacy',
      templateUrl:
        'dedicatedCloud/datacenter/backup/enableLegacy/dedicatedCloud-datacenter-backup-enableLegacy.html',
      controller: 'ovhManagerPccDatacenterBackupEnableLegacy',
      controllerAs: '$ctrl',
      layout: 'modal',
    });
  },
);

angular.module('App').config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.dedicatedClouds.datacenter.backup.enable', {
      url: '/enable',
      templateUrl:
        'dedicatedCloud/datacenter/backup/enable/dedicatedCloud-datacenter-backup-enable.html',
      controller: 'ovhManagerPccDatacenterBackupEnable',
      controllerAs: '$ctrl',
      layout: 'modal',
    });
  },
);

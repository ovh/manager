angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.datacenter.backup.disable', {
    url: '/disable',
    templateUrl:
      'dedicatedCloud/datacenter/backup/disable/dedicatedCloud-datacenter-backup-disable.html',
    controller: 'DedicatedCloudSubDatacenterVeeamBackupDisableCtrl',
    controllerAs: '$ctrl',
    layout: 'modal',
  });
});

angular.module('App').config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.dedicatedClouds.datacenter.backup-old', {
      url: '/backup-old',
      reloadOnSearch: false,
      views: {
        pccDatacenterView: {
          templateUrl:
            'dedicatedCloud/datacenter/backup/dedicatedCloud-datacenter-backup.html',
          controller: 'DedicatedCloudSubDatacenterVeeamCtrl',
        },
      },
    });
  },
);

angular.module('App').config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'app.dedicated-server.server.dashboard.monitoringUpdate',
      {
      url: '/monitoring/update',
      templateUrl:
        'dedicated/server/monitoring/update/dedicated-server-monitoring-update.html',
      controller: 'DedicatedServerMonitoringUpdateCtrl',
      controllerAs: '$ctrl',
      layout: 'modal',
      },
    );
  },
);

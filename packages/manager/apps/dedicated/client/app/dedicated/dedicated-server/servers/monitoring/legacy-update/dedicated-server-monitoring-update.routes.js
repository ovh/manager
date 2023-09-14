angular.module('App').config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'app.dedicated-server.server.dashboard.monitoringLegacyUpdate',
      {
        url: '/monitoring/legacy-update',
        templateUrl:
          'dedicated/dedicated-server/servers/monitoring/legacy-update/dedicated-server-monitoring-update.html',
        controller: 'DedicatedServerMonitoringLegacyUpdateCtrl',
        controllerAs: '$ctrl',
        layout: 'modal',
        resolve: {
          breadcrumb: () => null,
        },
      },
    );
  },
);

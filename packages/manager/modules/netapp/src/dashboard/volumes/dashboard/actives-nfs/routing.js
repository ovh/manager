export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.dashboard.volumes.dashboard.actives-nfs', {
    url: '/actives-nfs',
    component: 'ovhManagerNetAppVolumesDashboardActivesNFS',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('netapp_volumes_dashboard_actives_nfs_breadcrumb'),
      activesNFS: /* @ngInject */ (NetAppDashboardService) =>
        NetAppDashboardService.activesNFS,
    },
  });
};

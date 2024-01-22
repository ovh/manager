export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.dashboard.nsx',
    {
      resolve: {
        goBack: /* @ngInject */ (goBackToDashboard) => goBackToDashboard,
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'dedicated_cloud_datacenters_datacenter_manage_nsx_edge',
          ),
      },
      url: '/nsx',
      views: {
        'pccDatacenterView@app.dedicatedCloud.details.datacenter.details':
          'ovhManagerDedicatedCloudDatacenterManageNsxEdges',
      },
    },
  );
};

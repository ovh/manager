export default /* @ngInject */ ($stateProvider, NSX_TRACKING_PREFIX) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.dashboard.nsx',
    {
      resolve: {
        goBack: /* @ngInject */ (trackClick, goBackToDashboard) => () => {
          trackClick('::cancel');
          return goBackToDashboard();
        },
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'dedicated_cloud_datacenters_datacenter_manage_nsx_edge',
          ),
        trackingPrefix: () => NSX_TRACKING_PREFIX,
        trackPage: /* @ngInject */ (atInternet, trackingPrefix) => (hit) => {
          return atInternet.trackPage(`${trackingPrefix}${hit}`);
        },
        trackClick: /* @ngInject */ (atInternet, trackingPrefix) => (hit) => {
          return atInternet.trackClick({
            name: `${trackingPrefix}${hit}`,
            type: 'action',
          });
        },
      },
      atInternet: {
        rename: NSX_TRACKING_PREFIX,
      },
      url: '/nsx',
      views: {
        'pccDatacenterView@app.dedicatedCloud.details.datacenter.details':
          'ovhManagerDedicatedCloudDatacenterManageNsxEdges',
      },
    },
  );
};

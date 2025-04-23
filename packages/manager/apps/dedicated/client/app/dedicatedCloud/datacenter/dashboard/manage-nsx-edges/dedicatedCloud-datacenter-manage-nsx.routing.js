import { NSX_TRACKING_PREFIX } from './constants';

export default /* @ngInject */ ($stateProvider) => {
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
        trackPage: /* @ngInject */ (atInternet) => (hit) => {
          return atInternet.trackPage(`${NSX_TRACKING_PREFIX}${hit}`);
        },
        trackClick: /* @ngInject */ (atInternet) => (hit) => {
          return atInternet.trackClick({
            name: `${NSX_TRACKING_PREFIX}${hit}`,
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

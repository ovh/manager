import { TRACKING_DISPLAY_EDIT_NSX_EDGES_PREFIX } from './constants';
import { TRACKING_PREFIX_DATACENTER } from '../../dedicatedCloud-datacenter.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.dashboard.nsx',
    {
      resolve: {
        goBack: /* @ngInject */ (trackClick, goBackToDashboard) => () => {
          trackClick('::cancel'); // TODO this is not cohrent anymore with new nomenclature MANAGER-19493
          return goBackToDashboard();
        },
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'dedicated_cloud_datacenters_datacenter_manage_nsx_edge',
          ),
      },
      atInternet: {
        rename: `${TRACKING_PREFIX_DATACENTER}${TRACKING_DISPLAY_EDIT_NSX_EDGES_PREFIX}`,
      },
      url: '/nsx',
      views: {
        'pccDatacenterView@app.dedicatedCloud.details.datacenter.details':
          'ovhManagerDedicatedCloudDatacenterManageNsxEdges',
      },
    },
  );
};

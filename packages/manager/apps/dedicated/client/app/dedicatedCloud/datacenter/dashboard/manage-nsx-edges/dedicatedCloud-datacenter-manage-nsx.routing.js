import { TRACKING_DISPLAY_EDIT_NSX_EDGES_PREFIX } from './constants';
import {
  TRACKING_PREFIX_DATACENTER,
  TRACKING_ACTION_GO_BACK_PREFIX,
} from '../../dedicatedCloud-datacenter.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.dashboard.nsx',
    {
      resolve: {
        goBack: /* @ngInject */ (trackClick, goBackToDashboard) => () => {
          trackClick(`${TRACKING_ACTION_GO_BACK_PREFIX}nsx-edge-nodes`);
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

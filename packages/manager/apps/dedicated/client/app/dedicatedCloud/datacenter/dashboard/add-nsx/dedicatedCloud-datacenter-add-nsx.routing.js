import { TRACKING_DISPLAY_ADD_NSX_EDGES_PREFIX } from './constants';
import { TRACKING_PREFIX_DATACENTER } from '../../dedicatedCloud-datacenter.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.dashboard.add-nsx',
    {
      url: '/add-nsx',
      views: {
        'pccDatacenterView@app.dedicatedCloud.details.datacenter.details':
          'ovhManagerDedicatedCloudDatacenterAddNsx',
      },
      atInternet: {
        rename: `${TRACKING_PREFIX_DATACENTER}${TRACKING_DISPLAY_ADD_NSX_EDGES_PREFIX}`,
      },
      resolve: {
        goBack: /* @ngInject */ (goBackToDashboard) => () => {
          return goBackToDashboard();
        },
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'dedicated_cloud_datacenters_datacenter_manage_add_nsx',
          ),
        addNsx: /* @ngInject */ (
          ovhManagerPccDatacenterService,
          serviceName,
          datacenterId,
        ) => () =>
          ovhManagerPccDatacenterService.addNsxtEdge(serviceName, datacenterId),
        handleSuccess: /* @ngInject */ (Alerter, goBack) => (message) => {
          Alerter.success(message, 'dedicatedCloudDatacenterAlert');
          goBack();
        },
        handleError: /* @ngInject */ (Alerter, goBack) => (message) => {
          Alerter.error(message, 'dedicatedCloudDatacenterAlert');
          goBack();
        },
      },
    },
  );
};

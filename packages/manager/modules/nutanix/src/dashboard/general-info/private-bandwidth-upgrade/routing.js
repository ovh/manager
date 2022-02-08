import { PRIVATE_BANDWIDTH_SERVICE_PREFIX } from '../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'nutanix.dashboard.general-info.bandwidth-private-order',
    {
      url: '/bandwidth-private-order',
      views: {
        modal: {
          component: 'nutanixClusterOrderPrivateBandwidth',
        },
      },
      layout: 'modal',
      translations: { value: ['.'], format: 'json' },
      resolve: {
        goBack: /* @ngInject */ ($state) => () =>
          $state.go('nutanix.dashboard.general-info'),
        serviceId: /* @ngInject */ (clusterAddOns) =>
          clusterAddOns.find((addOn) =>
            addOn.billing?.plan?.code?.startsWith(
              PRIVATE_BANDWIDTH_SERVICE_PREFIX,
            ),
          )?.serviceId,
        breadcrumb: () => null,
        trackingPrefix: /* @ngInject */ () =>
          `hpc::nutanix::cluster::bandwidth-private-order`,
        hasDefaultPaymentMethod: /* @ngInject */ (ovhPaymentMethod) =>
          ovhPaymentMethod.hasDefaultPaymentMethod(),
      },
      atInternet: {
        rename: 'hpc::nutanix::cluster::bandwidth-private-order',
      },
    },
  );
};

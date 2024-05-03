import { PRIVATE_BANDWIDTH_SERVICE_NODE_PREFIX } from '../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'nutanix.dashboard.nodes.node.general-info.bandwidth-private-order',
    {
      url: '/bandwidth-private-order',
      views: {
        modal: {
          component: 'nutanixNodeGeneralInfoBandwidthPrivateOrder',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        hasDefaultPaymentMethod: /* @ngInject */ (ovhPaymentMethod) =>
          ovhPaymentMethod.hasDefaultPaymentMethod(),
        serviceId: /* @ngInject */ ($http, serviceInfos) =>
          $http
            .get(`/services/${serviceInfos.serviceId}/options`)
            .then(
              ({ data: options }) =>
                options.find((option) =>
                  option.billing.plan.code.startsWith(
                    PRIVATE_BANDWIDTH_SERVICE_NODE_PREFIX,
                  ),
                )?.serviceId,
            ),
        trackingPrefix: () =>
          'hpc::nutanix::cluster::node::bandwidth-private-order::',
      },
    },
  );
};

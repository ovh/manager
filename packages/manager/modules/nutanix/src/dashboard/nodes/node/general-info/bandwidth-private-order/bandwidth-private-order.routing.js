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
        goBack: /* @ngInject */ ($state) => () => $state.go('^'),
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
                    'cluster-vrack-bandwidth',
                  ),
                )?.serviceId,
            ),
        trackingPrefix: () =>
          'hpc::nutanix::cluster::node::bandwidth-private-order::',
      },
    },
  );
};

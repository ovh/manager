export default /* @ngInject */ ($stateProvider) => {
  // Parent states where the modal could be called
  const parentStates = [
    'app.dedicated-cluster.cluster.node.dashboard',
    'app.dedicated-cluster.cluster.node.interfaces',
  ];

  parentStates.forEach((parent) => {
    $stateProvider.state(`${parent}.bandwidth-private-order`, {
      url: '/bandwidth-private-order',
      views: {
        modal: {
          component: 'dedicatedClusterNodeBandwidthPrivateOrder',
        },
      },
      layout: 'modal',
      translations: { value: ['.'], format: 'json' },
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
                options.find(
                  (option) =>
                    option.billing.plan.code.startsWith('vrack-bandwidth') ||
                    option.billing.plan.code.startsWith(
                      'cluster-vrack-bandwidth',
                    ),
                )?.serviceId,
            ),
        trackClick: /* @ngInject */ (atInternet) => (name) =>
          atInternet.trackClick({
            name,
            type: 'action',
            chapter1: 'dedicated',
          }),
        trackingPrefix: /* @ngInject */ () =>
          'dedicated::node::interfaces::bandwidth-private-order::',
      },
    });
  });
};

export default /* @ngInject */ ($stateProvider) => {
  // Parent states where the modal could be called
  const parentStates = [
    'app.dedicated-cluster.cluster.node.dashboard',
    'app.dedicated-cluster.cluster.node.interfaces',
  ];

  parentStates.forEach((parent) => {
    $stateProvider.state(`${parent}.bandwidth-public-order`, {
      url: '/bandwidth-public-order',
      views: {
        modal: {
          component: 'dedicatedClusterNodeBandwidthPublicOrder',
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
                    option.resource.product.name.startsWith('bandwidth-') ||
                    option.resource.product.name.startsWith('traffic-'),
                )?.serviceId,
            ),
        trackingPrefix: () =>
          'dedicated::node::interfaces::bandwidth-public-order::',
      },
    });
  });
};

export default /* @ngInject */ ($stateProvider) => {
  // Parent states where the modal could be called
  const parentStates = [
    'app.dedicated-server.server.dashboard',
    'app.dedicated-server.server.interfaces',
  ];

  parentStates.forEach((parent) => {
    $stateProvider.state(`${parent}.bandwidth-private-order`, {
      url: '/bandwidth-private-order',
      views: {
        modal: {
          component: 'dedicatedServerBandwidthPrivateOrder',
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
                options.find((option) =>
                  option.resource.product.name.startsWith('vrack-bandwidth'),
                )?.serviceId,
            ),
        trackingPrefix: () =>
          'dedicated::server::interfaces::bandwidth-private-order::',
      },
    });
  });
};

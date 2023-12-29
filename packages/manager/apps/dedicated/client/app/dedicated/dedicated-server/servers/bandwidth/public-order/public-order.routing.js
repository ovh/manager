export default /* @ngInject */ ($stateProvider) => {
  // Parent states where the modal could be called
  const parentStates = [
    'app.dedicated-server.server.dashboard',
    'app.dedicated-server.server.interfaces',
  ];

  parentStates.forEach((parent) => {
    $stateProvider.state(`${parent}.bandwidth-public-order`, {
      url: '/bandwidth-public-order',
      views: {
        modal: {
          component: 'dedicatedServerBandwidthPublicOrder',
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
          'dedicated::server::interfaces::bandwidth-public-order::',
      },
    });
  });
};

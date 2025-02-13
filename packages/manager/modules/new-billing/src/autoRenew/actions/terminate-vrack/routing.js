export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('billing.autorenew.terminateVrack', {
    url: '/terminate-vrack?service&serviceType',
    views: {
      modal: {
        component: 'billingAutorenewTerminateVrack',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToAutorenew) => goToAutorenew,
      service: /* @ngInject */ ($transition$) => $transition$.params().service,
      serviceType: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceType,
      isEmpty: /* @ngInject */ (OvhApiVrack, service) =>
        OvhApiVrack.Aapi()
          .services({ serviceName: service })
          .$promise.then((allServicesParam) => {
            const services = Object.entries(allServicesParam).filter(
              ([, value]) => {
                return Array.isArray(value) && value.length;
              },
            );
            return !services.length;
          })
          .catch(() => {
            return false;
          }),
      breadcrumb: () => null,
    },
    atInternet: {
      ignore: true,
    },
  });
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('billing.autorenew.terminateWebCoachRedirection', {
    url: '/delete-webcoach?serviceId',
    redirectTo: 'billing.autorenew.services.terminateWebCoach',
  });

  $stateProvider.state('billing.autorenew.services.terminateWebCoach', {
    url: '/delete-webcoach?serviceId',
    views: {
      modal: {
        component: 'billingAutorenewTerminateWebCoach',
      },
    },
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
    resolve: {
      goBack: /* @ngInject */ (goToAutorenew) => goToAutorenew,
      serviceId: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceId,
      terminateWebCoach: /* @ngInject */ (OvhApiWebCoach, serviceId) => () =>
        OvhApiWebCoach.v6().terminate({ serviceName: serviceId }).$promise,
      breadcrumb: () => null,
    },
    atInternet: {
      ignore: true,
    },
  });
};

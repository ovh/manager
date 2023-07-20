export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vrack-services.dashboard', {
    url: '/:serviceName',
    component: 'vrackServices',
    resolve: {
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      dashboardLink: /* @ngInject */ ($state, serviceName) =>
        $state.href('vrack-services.dashboard', {
          serviceName,
        }),
      subnetLink: /* @ngInject */ ($state) =>
        $state.href('vrack-services.dashboard'), // TODO: Change link
      endpointsLink: /* @ngInject */ ($state) =>
        $state.href('vrack-services.dashboard'), // TODO: Change link
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      serviceInformations: /* @ngInject */ (serviceName) => {
        // TODO: add API Call when it's ready
        return {
          name: serviceName,
          status: 'ACTIVE',
          localization: 'RBX-1',
          vrack: 'pn-123456',
          creationDate: '2023-07-20T07:27:57.866Z',
        };
      },
      breadcrumb: /* @ngInject */ (serviceName) => serviceName,
    },
  });
};

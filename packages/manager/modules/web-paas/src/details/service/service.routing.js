export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('web-paas.details.service', {
    url: '/service',
    views: {
      projectView: 'webPaasDetailsService',
    },
    resolve: {
      terminateProject: /* @ngInject */ ($state, projectId) => () =>
        $state.go('web-paas.details.service.cancel', {
          projectId,
        }),

      breadcrumb: () => false,
    },
  });
};

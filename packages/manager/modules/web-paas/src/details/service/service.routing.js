export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('web-paas.dashboard.service', {
    url: '/service',
    views: {
      projectView: 'webPaasDetailsService',
    },
    resolve: {
      terminateProject: /* @ngInject */ ($state, projectId) => () =>
        $state.go('web-paas.dashboard.service.cancel', {
          projectId,
        }),
      goToAddStorage: /* @ngInject */ ($state, projectId) => () =>
        $state.go('web-paas.dashboard.service.add-storage', {
          projectId,
        }),
      goToEditPlan: /* @ngInject */ ($state, project) => () =>
        $state.go('web-paas.add', {
          selectedProject: project,
        }),
      breadcrumb: () => false,
    },
  });
};

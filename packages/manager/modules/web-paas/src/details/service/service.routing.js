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
      goToAddAddon: /* @ngInject */ ($state, projectId) => (addonType) =>
        $state.go('web-paas.dashboard.service.add-addon', {
          projectId,
          addonType,
        }),
      goToEditPlan: /* @ngInject */ ($state, project) => () =>
        $state.go('web-paas.add', {
          selectedProject: project,
        }),
      breadcrumb: () => false,
    },
  });
};

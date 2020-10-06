export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('platform-sh.details.service', {
    url: '/service',
    views: {
      projectView: 'platformShDetailsService',
    },
    resolve: {
      changeProjectName: /* @ngInject */ ($state, project, projectId) => () =>
        $state.go('platform-sh.details.service.edit-name', {
          projectId,
          project,
        }),
      terminateProject: /* @ngInject */ ($state, projectId) => () =>
        $state.go('platform-sh.details.service.cancel', {
          projectId,
        }),

      breadcrumb: () => false,
    },
  });
};

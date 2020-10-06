export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('platform-sh.details', {
    url: '/:projectId',
    component: 'platformShDetailComponent',
    resolve: {
      projectId: /* @ngInject */ ($transition$) => $transition$.params().projectId,
      project: /* @ngInject */ (PlatformSh, projectId) => PlatformSh.getProjectDetails(projectId),
      projectName: /* @ngInject */ (project) => project.projectName,
      serviceLink: /* @ngInject */ ($state, projectId) =>
        $state.href('platform-sh.details.service', {
          projectId,
        }),
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      goToProjectDetails: /* @ngInject */ ($state, CucCloudMessage) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const promise = $state.go(
          'platform-sh.details',
          {
            reload,
          },
        );
        if (message) {
          promise.then(() => CucCloudMessage[type](message, 'platform-sh.details'));
        }

        return promise;
      },
      breadcrumb: /* @ngInject */ (project) => project.projectName,
    },
    redirectTo: 'platform-sh.details.service',
  });
};

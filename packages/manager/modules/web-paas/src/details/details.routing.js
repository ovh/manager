export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('web-paas.dashboard', {
    url: '/:projectId',
    component: 'webPaasDetailComponent',
    resolve: {
      projectId: /* @ngInject */ ($transition$) =>
        $transition$.params().projectId,
      project: /* @ngInject */ (WebPaas, projectId) =>
        WebPaas.getProjectDetails(projectId),
      projectName: /* @ngInject */ (project) => project.projectName,
      serviceLink: /* @ngInject */ ($state, projectId) =>
        $state.href('web-paas.dashboard.service', {
          projectId,
        }),
      userLink: /* @ngInject */ ($state, projectId) =>
        $state.href('web-paas.dashboard.user-licences', {
          projectId,
        }),
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      goToProjectDetails: /* @ngInject */ ($state, Alerter) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const promise = $state.go('web-paas.dashboard', {
          reload,
        });
        if (message) {
          promise.then(() => {
            Alerter.alertFromSWS(message, type);
          });
        }

        return promise;
      },
      breadcrumb: /* @ngInject */ (project) => project.projectName,
    },
    redirectTo: 'web-paas.dashboard.service',
  });
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('web-paas.details', {
    url: '/:projectId',
    component: 'webPaasDetailComponent',
    resolve: {
      projectId: /* @ngInject */ ($transition$) =>
        $transition$.params().projectId,
      project: /* @ngInject */ (WebPaas, projectId) =>
        WebPaas.getProjectDetails(projectId),
      projectName: /* @ngInject */ (project) => project.projectName,
      serviceLink: /* @ngInject */ ($state, projectId) =>
        $state.href('web-paas.details.service', {
          projectId,
        }),
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      goToProjectDetails: /* @ngInject */ ($state, Alerter) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const promise = $state.go('web-paas.details', {
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
    redirectTo: 'web-paas.details.service',
  });
};

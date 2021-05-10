import find from 'lodash/find';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('web-paas.dashboard', {
    url: '/projects/:projectId',
    component: 'webPaasDetailComponent',
    resolve: {
      projectId: /* @ngInject */ ($transition$) =>
        $transition$.params().projectId,
      catalog: /* @ngInject */ (WebPaas, user) =>
        WebPaas.getCatalog(user.ovhSubsidiary),
      project: /* @ngInject */ (WebPaas, projectId) =>
        WebPaas.getProjectDetails(projectId),
      selectedPlan: /* @ngInject */ (catalog, project) =>
        project.setSelectedPlan(
          find(catalog.plans, { planCode: project.offer }),
        ),
      projectName: /* @ngInject */ (project) => project.projectName,
      serviceInfo: /* @ngInject */ (projectId, WebPaas) =>
        WebPaas.getServiceInfos(projectId),
      serviceLink: /* @ngInject */ ($state, projectId) =>
        $state.href('web-paas.dashboard.service', {
          projectId,
        }),
      userLink: /* @ngInject */ ($state, projectId) =>
        $state.href('web-paas.dashboard.user-licences', {
          projectId,
        }),
      userList: /* @ngInject */ (WebPaas, projectId) =>
        WebPaas.getUsers(projectId),
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
            Alerter[type](message, 'web_paas_dashboard_alert');
          });
        }

        return promise;
      },
      breadcrumb: /* @ngInject */ (project) => project.projectName,
    },
    redirectTo: 'web-paas.dashboard.service',
  });
};

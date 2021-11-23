export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.ai.apps.dashboard', {
    url: '/:appId',
    component: 'ovhManagerPciProjectAppsDashboard',
    resolve: {
      breadcrumb: /* @ngInject */ (app) => app.id,

      appId: /* @ngInject */ ($transition$) => $transition$.params().appId,

      app: /* @ngInject */ (apps, appId) => {
        return apps.find(({ id }) => id === appId);
      },

      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),

      generalInformationLink: /* @ngInject */ ($state, projectId, appId) =>
        $state.href(
          'pci.projects.project.ai.apps.dashboard.general-information',
          {
            projectId,
            appId,
          },
        ),

      attachDataLink: /* @ngInject */ ($state, projectId, appId) =>
        $state.href('pci.projects.project.ai.apps.dashboard.attach-data', {
          projectId,
          appId,
        }),

      userAndRolesLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.users.add', {
          projectId,
        }),
    },
    redirectTo: 'pci.projects.project.ai.apps.dashboard.general-information',
  });
};

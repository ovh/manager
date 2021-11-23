export default /* @ngInject */ ($stateProvider) => {
  const stateName =
    'pci.projects.project.ai.apps.dashboard.general-information';
  $stateProvider.state(stateName, {
    url: '/general-information',
    views: {
      appView: 'ovhManagerPciProjectAppGeneralInformation',
    },
    resolve: {
      breadcrumb: () => false,

      goBack: /* @ngInject */ (app, goToApp) => (message, type) =>
        goToApp(app, message, type),

      flavors: /* @ngInject */ (projectId, app, AppService) =>
        AppService.getFlavors(projectId, app.region),

      flavor: /* @ngInject */ (app, flavors) => app.getSelectedFlavor(flavors),

      goToAttachData: /* @ngInject */ ($state, projectId, app) => () =>
        $state.go('pci.projects.project.ai.apps.dashboard.attach-data', {
          projectId,
          appId: app.id,
        }),

      goToDeleteApp: /* @ngInject */ (
        $state,
        projectId,
        app,
        trackApps,
      ) => () =>
        $state.go(
          'pci.projects.project.ai.apps.dashboard.general-information.delete-app',
          {
            projectId,
            appId: app.id,
            trackApps,
          },
        ),
    },
  });
};

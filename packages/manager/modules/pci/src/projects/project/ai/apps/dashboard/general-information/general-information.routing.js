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

      goBack: /* @ngInject */ (app, goToApp) => (message, type) => {
        return goToApp(app, message, type);
      },

      flavors: /* @ngInject */ (projectId, app, AppService) =>
        AppService.getFlavors(projectId, app.region),

      flavor: /* @ngInject */ (app, flavors) => app.getSelectedFlavor(flavors),

      goToAttachData: /* @ngInject */ ($state, projectId, app) => () =>
        $state.go('pci.projects.project.ai.apps.dashboard.attach-data', {
          projectId,
          appId: app.id,
        }),

      goToUpdateScaling: /* @ngInject */ ($state, projectId, app) => () =>
        $state.go(
          'pci.projects.project.ai.apps.dashboard.general-information.update-scaling',
          {
            projectId,
            appId: app.id,
          },
        ),

      goToGenerateToken: /* @ngInject */ ($state, projectId, app) => () =>
        $state.go(
          'pci.projects.project.ai-dashboard.users-tokens.create-token',
          {
            projectId,
            labelSelector: `id=${app.id}`,
          },
        ),

      goToStartApp: /* @ngInject */ ($state, projectId, app) => () =>
        $state.go(
          'pci.projects.project.ai.apps.dashboard.general-information.start',
          {
            projectId,
            app,
          },
        ),

      goToStopApp: /* @ngInject */ ($state, projectId, app) => () =>
        $state.go(
          'pci.projects.project.ai.apps.dashboard.general-information.stop',
          {
            projectId,
            app,
          },
        ),

      goToDeleteApp: /* @ngInject */ ($state, projectId, app) => () =>
        $state.go(
          'pci.projects.project.ai.apps.dashboard.general-information.delete',
          {
            projectId,
            app,
          },
        ),
      goToUpdateAppImage: /* @ngInject */ ($state, projectId, app) => () =>
        $state.go(
          'pci.projects.project.ai.apps.dashboard.general-information.update-image',
          {
            projectId,
            app,
          },
        ),
      goToUpdateAppPort: /* @ngInject */ ($state, projectId, app) => () =>
        $state.go(
          'pci.projects.project.ai.apps.dashboard.general-information.update-port',
          {
            projectId,
            app,
          },
        ),
    },
  });
};

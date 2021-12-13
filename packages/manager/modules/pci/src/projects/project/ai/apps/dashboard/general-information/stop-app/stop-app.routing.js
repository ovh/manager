import App from '../../../App.class';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.ai.apps.dashboard.general-information.stop-app',
    {
      url: '/stop-app',
      views: {
        modal: {
          component: 'pciAppsAppDashboardAppStop',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,

        appId: /* @ngInject */ ($transition$) => $transition$.params().appId,

        appModel: /* @ngInject */ (projectId, appId, AppService) =>
          AppService.getApp(projectId, appId),

        app: /* @ngInject */ (appModel) => new App(appModel, null, null),
      },
    },
  );
};

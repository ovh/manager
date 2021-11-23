import App from '../../../App.class';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.ai.apps.dashboard.general-information.delete-app',
    {
      url: '/delete-app',
      views: {
        modal: {
          component: 'pciAppsAppDashboardAppDelete',
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

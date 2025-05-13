export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.ai.apps.dashboard.general-information.stop',
    {
      url: '/stop',
      params: { app: null },
      views: {
        modal: {
          component: 'ovhManagerPciProjectAppsStopApp',
        },
      },
      layout: 'modal',
      resolve: {
        app: /* @ngInject */ ($transition$) => $transition$.params().app,
        breadcrumb: () => null,
        trackingPrefix: () => 'dashboard',
      },
    },
  );
};

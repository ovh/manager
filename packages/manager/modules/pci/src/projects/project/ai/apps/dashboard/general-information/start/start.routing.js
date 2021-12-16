export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.ai.apps.dashboard.general-information.start',
    {
      url: '/start',
      params: { app: null },
      views: {
        modal: {
          component: 'ovhManagerPciProjectAppsStartApp',
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

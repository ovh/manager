export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.ai.apps.dashboard.general-information.delete',
    {
      url: '/delete',
      params: { app: null },
      views: {
        modal: {
          component: 'ovhManagerPciProjectAppsDeleteApp',
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

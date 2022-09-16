export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.ai.apps.dashboard.general-information.update-scaling',
    {
      url: '/update-scaling',
      // params: { app: null },
      views: {
        modal: {
          component: 'ovhManagerPciProjectAppsUpdateAppScaling',
        },
      },
      layout: 'modal',
      resolve: {
        // app: /* @ngInject */ ($transition$) => $transition$.params().app,
        breadcrumb: () => null,
        trackingPrefix: () => 'dashboard',
        prices: /* @ngInject */ (projectId, CucPriceHelper) =>
          CucPriceHelper.getPrices(projectId),
      },
    },
  );
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.ai.apps.dashboard.general-information.update-scaling',
    {
      url: '/update-scaling',
      views: {
        modal: {
          component: 'ovhManagerPciProjectAppsUpdateAppScaling',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        trackingPrefix: () => 'dashboard',
        prices: /* @ngInject */ (projectId, CucPriceHelper) =>
          CucPriceHelper.getPrices(projectId),
      },
    },
  );
};

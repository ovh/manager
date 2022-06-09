export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.notebooks.dashboard.general-information.stop-notebook',
    {
      url: '/stop-notebook',
      params: { notebook: null },
      views: {
        modal: {
          component: 'pciNotebooksStopNotebook',
        },
      },
      layout: 'modal',
      resolve: {
        notebook: /* @ngInject */ ($transition$) =>
          $transition$.params().notebook,
        breadcrumb: () => null,
        trackingPrefix: () => 'dashboard',
      },
    },
  );
};

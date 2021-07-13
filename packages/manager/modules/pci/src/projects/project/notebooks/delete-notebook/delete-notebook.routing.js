export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.notebooks.delete', {
    url: '/delete',
    params: { notebook: null },
    views: {
      modal: {
        component: 'ovhManagerPciProjectNotebooksDeleteNotebook',
      },
    },
    layout: 'modal',
    resolve: {
      notebook: /* @ngInject */ ($transition$) =>
        $transition$.params().notebook,
      goBack: /* @ngInject */ (goToNotebooks) => goToNotebooks,
      breadcrumb: () => null,
      trackingPrefix: () => 'table::options_menu',
    },
  });
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.quantum-computing.delete', {
    url: '/delete',
    params: { notebook: null },
    views: {
      modal: {
        component: 'ovhManagerPciProjectQuantumComputingDeleteNotebook',
      },
    },
    layout: 'modal',
    resolve: {
      notebook: /* @ngInject */ ($transition$) =>
        $transition$.params().notebook,
      goBack: /* @ngInject */ (goToQuantumComputing) => goToQuantumComputing,
      breadcrumb: () => null,
      trackingPrefix: () => 'table::options_menu',
    },
  });
};

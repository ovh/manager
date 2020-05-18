export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.kubernetes.details.nodepools.details.nodes.bulk-delete', {
    url: '/delete',
    views: {
      modal: {
        component: 'pciProjectKubernetesNodesBulkDeleteComponent',
      },
    },
    layout: 'modal',
    params: {
      nodeCount: null,
    },
    resolve: {
      goBack: /* @ngInject */ (goToNodes) => goToNodes,
      nodeCount: /* @ngInject */ ($transition$) => $transition$.params().nodeCount,
      breadcrumb: () => null,
    },
  });
};

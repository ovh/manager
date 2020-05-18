export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.kubernetes.details.nodepools.details.nodes.delete', {
    url: '/:nodeId/delete',
    views: {
      modal: {
        component: 'pciProjectKubernetesNodesDeleteComponent',
      },
    },
    layout: 'modal',
    params: {
      nodeName: null,
    },
    resolve: {
      goBack: /* @ngInject */ (goToNodes) => goToNodes,
      nodeId: /* @ngInject */ ($transition$) => $transition$.params().nodeId,
      nodeName: /* @ngInject */ ($transition$) => $transition$.params().nodeName,
      breadcrumb: () => null,
    },
  });
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.kubernetes.details.nodes.delete', {
    url: '/delete?nodeId',
    views: {
      modal: {
        component: 'pciProjectKubernetesNodesDeleteComponent',
      },
    },
    layout: 'modal',
    params: {
      nodeId: null,
    },
    resolve: {
      goBack: /* @ngInject */ (goToKubernetesNodes) => goToKubernetesNodes,
      nodeId: /* @ngInject */ ($stateParams) => $stateParams.nodeId,
      breadcrumb: () => null,
    },
  });
};

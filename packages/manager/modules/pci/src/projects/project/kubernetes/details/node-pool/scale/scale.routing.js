export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.kubernetes.details.nodepools.scale',
    {
      url: '/scale?nodePoolId',
      views: {
        modal: {
          component: 'pciProjectKubernetesNodePoolsScaleComponent',
        },
      },
      layout: 'modal',
      params: {
        nodePoolId: null,
        nodePoolName: null,
      },
      resolve: {
        goBack: /* @ngInject */ (goToNodePools) => goToNodePools,

        nodePool: /* @ngInject */ (
          Kubernetes,
          kubeId,
          nodePoolId,
          projectId,
          autoscaling,
        ) =>
          Kubernetes.getNodePool(
            projectId,
            kubeId,
            nodePoolId,
          ).then((nodePool) => ({ ...nodePool, autoscaling })),

        nodePoolId: /* @ngInject */ ($transition$) =>
          $transition$.params().nodePoolId,

        nodePoolName: /* @ngInject */ ($transition$) =>
          $transition$.params().nodePoolName,

        breadcrumb: () => null,
      },
    },
  );
};

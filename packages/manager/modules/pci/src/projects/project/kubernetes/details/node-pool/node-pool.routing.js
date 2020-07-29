import map from 'lodash/map';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.kubernetes.details.nodepools', {
    url: '/nodepools',
    views: {
      kubernetesView: 'ovhManagerPciProjectKubernetesNodePoolsComponent',
    },
    translations: {
      value: ['.', './nodes'],
      format: 'json',
    },
    resolve: {
      addNodePool: /* @ngInject */ ($state, kubeId, projectId) => () =>
        $state.go('pci.projects.project.kubernetes.details.nodepools.add', {
          kubeId,
          projectId,
        }),

      editNodePool: /* @ngInject */ ($state, kubeId, projectId) => (nodePoolId, nodePool) =>
        $state.go('pci.projects.project.kubernetes.details.nodepools.nodes', {
          kubeId,
          projectId,
          nodePoolId,
          nodePool,
        }),

      deleteNodePool: /* @ngInject */ ($state, kubeId, projectId) => (
        nodePoolId,
        nodePoolName,
      ) =>
        $state.go('pci.projects.project.kubernetes.details.nodepools.delete', {
          kubeId,
          projectId,
          nodePoolId,
          nodePoolName,
        }),

      getNodesStateHref: /* @ngInject */ ($state, kubeId, projectId) => (nodePoolId) =>
          $state.href(
            'pci.projects.project.kubernetes.details.nodepools.details',
            {
              projectId,
              kubeId,
              nodePoolId,
            }
          ),

      nodePools: /* @ngInject */ (Kubernetes, kubeId, projectId) =>
        Kubernetes.getNodePools(projectId, kubeId),

      refreshNodePools: /* @ngInject */ ($state) => () => $state.reload(),

      goToNodePools: ($state, CucCloudMessage, kubeId, projectId) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'pci.projects.project.kubernetes.details.nodepools',
          {
            kubeId,
            projectId,
          },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() =>
            CucCloudMessage[type](
              message,
              'pci.projects.project.kubernetes.details.nodepools',
            ),
          );
        }

        return promise;
      },

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('kube_node_pools'),
    },
  });

  $stateProvider.state('pci.projects.project.kubernetes.details.nodepools.details', {
    url: '/:nodePoolId',
    redirectTo: 'pci.projects.project.kubernetes.details.nodepools.details.nodes',
    template: `<div data-ui-view></div>`,
    resolve: {
      nodePool: /* @ngInject */ (Kubernetes, kubeId, projectId, nodePoolId) =>
        Kubernetes
          .getNodePool(projectId, kubeId, nodePoolId),
      nodePoolId: /* @ngInject */ ($transition$) =>  $transition$.params().nodePoolId,
      nodePoolName: /* @ngInject */ (nodePool) =>  nodePool.name,
      breadcrumb: /* @ngInject */ (nodePool) => nodePool.name,
    }
  });
};

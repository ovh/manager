import find from 'lodash/find';
import map from 'lodash/map';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.kubernetes.details.nodepools.details.nodes', {
    url: '/nodes',
    component: 'ovhManagerPciProjectKubernetesNodePoolNodesComponent',
    resolve: {
      addNode: /* @ngInject */ ($state, kubeId, projectId, nodePoolId) => (flavor, nodeCount) =>
        $state.go('pci.projects.project.kubernetes.details.nodepools.details.nodes.add', {
          kubeId,
          projectId,
          nodePoolId,
          flavor,
          nodeCount,
        }),

      deleteNode: /* @ngInject */ ($state, kubeId, projectId, nodePoolId) => (nodeId, nodeName) =>
        $state.go('pci.projects.project.kubernetes.details.nodepools.details.nodes.delete', {
          kubeId,
          projectId,
          nodePoolId,
          nodeId,
          nodeName,
        }),

      bulkDelete: /* @ngInject */ ($state, kubeId, projectId, nodePoolId) => (nodeCount) =>
        $state.go('pci.projects.project.kubernetes.details.nodepools.details.nodes.bulk-delete', {
          kubeId,
          projectId,
          nodePoolId,
          nodeCount,
        }),

      switchBillingType: /* @ngInject */ ($state, kubeId, projectId, nodePoolId) => (
        nodeId,
        nodeName,
        instanceId,
      ) =>
        $state.go(
          'pci.projects.project.kubernetes.details.nodepools.details.nodes.billing-type',
          {
            instanceId,
            kubeId,
            projectId,
            nodePoolId,
            nodeId,
            nodeName,
          },
        ),

      flavors: /* @ngInject */ (PciProjectFlavors, cluster, projectId) =>
        PciProjectFlavors.getFlavors(projectId, cluster.region),

      nodePoolFlavor: /* @ngInject */ (flavors, nodePool) =>
        find(flavors, { name: nodePool.flavor }),

      formattedFlavor: /* @ngInject */ (cluster, Kubernetes, nodePoolFlavor) =>
        Kubernetes.formatFlavor({
          ...nodePoolFlavor,
          region: cluster.region,
        }),

      nodes: /* @ngInject */ (formattedFlavor, Kubernetes, kubeId, projectId, nodePoolId) =>
        Kubernetes
          .getNodes(projectId, kubeId, nodePoolId)
          .then(nodes => map(nodes, node => {
            return {
              ...node,
              formattedFlavor
            }
          })),

      refreshNodes: /* @ngInject */ ($state) => () => {
        return $state.reload();
      },

      goToNodes: ($state, CucCloudMessage, kubeId, projectId, nodePoolId) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'pci.projects.project.kubernetes.details.nodepools.details.nodes',
          {
            kubeId,
            projectId,
            nodePoolId,
          },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() =>
            CucCloudMessage[type](
              message,
              'pci.projects.project.kubernetes.details.nodepools.details.nodes',
            ),
          );
        }

        return promise;
      },

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('kube_nodes'),
    },
  });
};

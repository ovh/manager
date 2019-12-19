export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.kubernetes.details.nodes', {
      url: '/nodes',
      views: {
        kubernetesView: 'ovhManagerPciProjectKubernetesNodesComponent',
      },
      resolve: {
        addNode: /* @ngInject */ (
          $state, kubeId, projectId,
        ) => () => $state.go('pci.projects.project.kubernetes.details.nodes.add', {
          kubeId,
          projectId,
        }),

        deleteNode: /* @ngInject */ (
          $state, kubeId, projectId,
        ) => (nodeId) => $state.go('pci.projects.project.kubernetes.details.nodes.delete', {
          kubeId,
          projectId,
          nodeId,
        }),

        switchBillingType: /* @ngInject */ (
          $state, kubeId, projectId,
        ) => (nodeId, nodeName, instanceId) => $state.go('pci.projects.project.kubernetes.details.nodes.billing-type', {
          instanceId,
          kubeId,
          projectId,
          nodeId,
          nodeName,
        }),

        nodes: /* @ngInject */ (
          kubeId,
          OvhApiCloudProjectKube,
          projectId,
        ) => OvhApiCloudProjectKube.Node().v6().query({
          serviceName: projectId,
          kubeId,
        }).$promise,

        refreshNodes: /* @ngInject */ ($state, OvhApiCloudProjectKube) => () => {
          OvhApiCloudProjectKube.Node().v6().resetQueryCache();
          OvhApiCloudProjectKube.Node().v6().resetCache();
          return $state.reload();
        },

        goToKubernetesNodes: ($state, CucCloudMessage, kubeId, projectId) => (message = false, type = 'success') => {
          const reload = message && type === 'success';

          const promise = $state.go('pci.projects.project.kubernetes.details.nodes', {
            kubeId,
            projectId,
          },
          {
            reload,
          });

          if (message) {
            promise.then(() => CucCloudMessage[type](message, 'pci.projects.project.kubernetes.details.nodes'));
          }

          return promise;
        },

        breadcrumb: /* @ngInject */ ($translate) => $translate.instant('kube_nodes'),
      },
    });
};

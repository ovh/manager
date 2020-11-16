import get from 'lodash/get';
import find from 'lodash/find';
import min from 'lodash/min';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.kubernetes.details.nodepools.details.nodes.add',
    {
      url: '/name',
      component: 'pciProjectKubernetesNodesAddComponent',
      redirectTo: (transition) =>
        transition
          .injector()
          .getAsync('flavor')
          .then((flavor) => {
            if (!flavor) {
              return {
                state:
                  'pci.projects.project.kubernetes.details.nodepools.details.nodes',
              };
            }
            return false;
          }),
      params: {
        flavor: null,
        nodeCount: 0,
      },
      translations: {
        value: ['.'],
        format: 'json',
      },
      resolve: {
        cancelLink: /* @ngInject */ ($state, projectId, kubeId, nodePoolId) =>
          $state.href(
            'pci.projects.project.kubernetes.details.nodepools.details',
            {
              projectId,
              kubeId,
              nodePoolId,
            },
          ),
        goBack: /* @ngInject */ (goToNodes) => goToNodes,
        quotas: /* @ngInject */ (OvhApiCloudProjectQuota, projectId) =>
          OvhApiCloudProjectQuota.v6().query({ serviceName: projectId })
            .$promise,
        maxInstances: /* @ngInject */ (quotas, cluster, nodePool) => {
          const quota = find(quotas, { region: cluster.region });
          const maxNodes =
            get(quota, 'instance.maxInstances', 0) -
            get(quota, 'instance.usedInstances', 0);
          return min([maxNodes, nodePool.maxNodes]) - nodePool.currentNodes;
        },
        goToProjectQuota: /* @ngInject */ ($state, projectId) => () =>
          $state.go('pci.projects.project.quota', { projectId }),
        flavor: /* @ngInject */ ($transition$) => $transition$.params().flavor,
        nodeCount: /* @ngInject */ ($transition$) =>
          $transition$.params().nodeCount,
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('kube_nodes_add_nodes'),
      },
    },
  );
};

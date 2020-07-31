import find from 'lodash/find';

import Datacenter from '../../../../../../components/project/regions-list/datacenter.class';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.kubernetes.details.nodepools.add',
    {
      url: '/new',
      component: 'pciProjectKubernetesNodePoolsAddComponent',
      translations: {
        value: ['.'],
        format: 'json',
      },
      resolve: {
        goBack: /* @ngInject */ (goToNodePools) => goToNodePools,
        quota: /* @ngInject */ (cluster, OvhApiCloudProjectQuota, projectId) =>
          OvhApiCloudProjectQuota.v6().query({ serviceName: projectId })
          .$promise
          .then((quotaList) => find(quotaList, { region: cluster.region })),
        region: /* @ngInject */ (cluster, quota) => {
          return new Datacenter({
            name: cluster.region,
            quota: quota,
          });
        },
        cancelLink: /* @ngInject */ ($state, projectId, kubeId) =>
          $state.href('pci.projects.project.kubernetes.details.nodepools', {
            projectId,
            kubeId,
          }),
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('kube_node_pool_add'),
      },
    },
  );
};

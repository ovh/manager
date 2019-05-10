export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.kubernetes.details.nodes.add', {
      url: '/name',
      views: {
        modal: {
          component: 'pciProjectKubernetesNodesAddComponent',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ goToKubernetesNodes => goToKubernetesNodes,
        flavors: /* @ngInject */ (
          cluster,
          OvhApiCloudProjectFlavor,
          projectId,
        ) => OvhApiCloudProjectFlavor.v6().query({
          serviceName: projectId,
          region: cluster.region,
        }),
        quotas: /* @ngInject */ (
          OvhApiCloudProjectQuota,
          projectId,
        ) => OvhApiCloudProjectQuota
          .v6()
          .query({ serviceName: projectId })
          .$promise,
        prices: /* @ngInject */ (
          CucPriceHelper,
          projectId,
        ) => CucPriceHelper.getPrices(projectId),
        goToProjectQuota: /* @ngInject */ (
          $state,
          projectId,
        ) => () => $state.go('pci.projects.project.quota', { projectId }),
      },
    });
};

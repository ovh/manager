export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.kubernetes.details.nodepools.delete',
    {
      url: '/delete?nodePoolId',
      views: {
        modal: {
          component: 'pciProjectKubernetesNodePoolsDeleteComponent',
        },
      },
      layout: 'modal',
      translations: {
        value: ['.'],
        format: 'json',
      },
      params: {
        nodePoolId: null,
        nodePoolName: null,
      },
      resolve: {
        goBack: /* @ngInject */ (goToNodePools) => goToNodePools,
        nodePoolId: /* @ngInject */ ($stateParams) => $stateParams.nodePoolId,
        nodePoolName: /* @ngInject */ ($stateParams) =>
          $stateParams.nodePoolName,
        breadcrumb: () => null,
      },
    },
  );
};

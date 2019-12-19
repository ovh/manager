export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.kubernetes.details.nodes.billing-type', {
      url: '/billing-type?nodeId',
      views: {
        modal: {
          component: 'pciProjectsProjectKubernetesNodesBillingTypeComponent',
        },
      },
      layout: 'modal',
      params: {
        instanceId: null,
        nodeId: null,
        nodeName: null,
      },
      resolve: {
        goBack: /* @ngInject */ (goToKubernetesNodes) => goToKubernetesNodes,
        nodeId: /* @ngInject */ ($transition$) => $transition$.params().nodeId,
        nodeName: /* @ngInject */ ($transition$) => $transition$.params().nodeName,
        instanceId: /* @ngInject */ ($transition$) => $transition$.params().instanceId,
      },
    });
};

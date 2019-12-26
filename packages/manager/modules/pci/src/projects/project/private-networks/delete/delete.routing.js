export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.privateNetwork.delete', {
    url: '/delete?networkId',
    views: {
      modal: {
        component: 'pciProjectPrivateNetworksDelete',
      },
    },
    params: {
      networkId: null,
    },
    resolve: {
      goBack: /* @ngInject */ (goToPrivateNetworks) => goToPrivateNetworks,
      networkId: /* @ngInject */ ($transition$) =>
        $transition$.params().networkId,
      breadcrumb: () => null,
    },
    layout: 'modal',
  });
};

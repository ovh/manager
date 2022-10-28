export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.privateNetwork.delete', {
    url: '/delete?networkId&subnetId',
    views: {
      modal: {
        component: 'pciProjectPrivateNetworksDelete',
      },
    },
    params: {
      networkId: null,
      region: null,
    },
    resolve: {
      goBack: /* @ngInject */ (goToPrivateNetworks) => goToPrivateNetworks,
      onCancelClick: /* @ngInject */ (trackPrivateNetworks, goBack) => () => {
        trackPrivateNetworks('delete::cancel');
        return goBack();
      },
      networkId: /* @ngInject */ ($transition$) =>
        $transition$.params().networkId,
      region: /* @ngInject */ ($transition$) => $transition$.params().region,
      breadcrumb: () => null,
    },
    atInternet: {
      rename: 'pci::projects::project::privateNetwork::delete',
    },
    layout: 'modal',
  });
};

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
      subnetId: null,
    },
    resolve: {
      goBack: /* @ngInject */ (goToPrivateNetworks) => goToPrivateNetworks,
      onCancelClick: /* @ngInject */ (trackPrivateNetworks, goBack) => () => {
        trackPrivateNetworks('delete::cancel');
        return goBack();
      },
      networkId: /* @ngInject */ ($transition$) =>
        $transition$.params().networkId,
      subnetId: /* @ngInject */ ($transition$) =>
        $transition$.params().subnetId,
      breadcrumb: () => null,
    },
    atInternet: {
      rename: 'PublicCloud::pci::projects::project::privateNetwork::delete',
    },
    layout: 'modal',
  });
};

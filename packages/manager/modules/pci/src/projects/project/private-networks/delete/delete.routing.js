export default /* @ngInject */($stateProvider) => {
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
      goBack: ($state, projectId) => () => $state.go('^', { projectId }),
      messageContainer: () => 'pci.projects.project.privateNetwork',
      networkId: /* @ngInject */ $transition$ => $transition$.params().networkId,
    },
    layout: 'modal',
  });
};

export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('pci.projects.project.privateNetwork.list.delete', {
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
      messageContainer: () => 'pci.projects.project.privateNetwork.list',
      networkId: /* @ngInject */ $transition$ => $transition$.params().networkId,
    },
    layout: 'modal',
  });
};

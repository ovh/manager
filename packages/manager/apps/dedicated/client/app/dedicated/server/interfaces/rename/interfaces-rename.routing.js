export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated.server.interfaces.rename', {
    url: '/rename',
    views: {
      modal: {
        component: 'dedicatedServerInterfacesRename',
      },
    },
    params: {
      interface: null,
    },
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
    resolve: {
      goBack: /* @ngInject */ $state => (params, transitionParams) => $state.go('^', params, transitionParams),
      interface: /* @ngInject */ $transition$ => _.cloneDeep($transition$.params().interface),
    },
  });
};

import cloneDeep from 'lodash/cloneDeep';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-server.server.interfaces.rename', {
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
      goBack: /* @ngInject */ ($state) => (params, transitionParams) =>
        $state.go('^', params, transitionParams),
      interface: /* @ngInject */ ($transition$) =>
        cloneDeep($transition$.params().interface),
    },
  });
};

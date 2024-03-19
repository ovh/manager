import cloneDeep from 'lodash/cloneDeep';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-cluster.cluster.node.interfaces.rename', {
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
    resolve: {
      goBack: /* @ngInject */ ($state) => (params, transitionParams) =>
        $state.go('^', params, transitionParams),
      interface: /* @ngInject */ ($transition$) =>
        cloneDeep($transition$.params().interface),
      breadcrumb: () => null,
    },
  });
};

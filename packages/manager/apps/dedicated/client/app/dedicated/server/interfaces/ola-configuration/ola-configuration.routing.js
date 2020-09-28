export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicated-server.server.interfaces.ola-configuration',
    {
    url: '/ola-configuration',
    views: {
        'tabView@app.dedicated-server.server': {
        component: 'dedicatedServerInterfacesOlaConfiguration',
      },
    },
    resolve: {
      goBack: /* @ngInject */ ($state) => (params) =>
          $state.go('app.dedicated-server.server.interfaces', params, {
            reload: true,
          }),
      },
    },
  );
};

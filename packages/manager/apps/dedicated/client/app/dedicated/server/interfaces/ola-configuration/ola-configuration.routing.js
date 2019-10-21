export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated.server.interfaces.ola-configuration', {
    url: '/ola-configuration',
    translations: { value: ['.'], format: 'json' },
    views: {
      'tabView@app.dedicated.server': {
        component: 'dedicatedServerInterfacesOlaConfiguration',
      },
    },
    resolve: {
      goBack: /* @ngInject */ $state => params => $state.go(
        'app.dedicated.server.interfaces',
        params,
        { reload: true },
      ),
    },
  });
};

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
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('dedicated_server_interfaces_ola_title'),
      },
    },
  );
};

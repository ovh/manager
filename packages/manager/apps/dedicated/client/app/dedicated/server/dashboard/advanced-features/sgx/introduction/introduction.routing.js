export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicated-server.server.dashboard.sgx.introduction',
    {
      url: '/introduction',
      views: {
        'tabView@app.dedicated-server.server': {
          component: 'dedicatedServerDashboardSgxIntroduction',
        },
      },
      resolve: {
        goBack: /* @ngInject */ ($state) => (params = {}, transitionParams) =>
          $state.go(
            'app.dedicated-server.server.dashboard',
            params,
            transitionParams,
          ),
        goToManage: /* @ngInject */ ($state, atInternet) => (
          params = {},
          transitionParams,
        ) => {
          atInternet.trackClick({
            name: 'dedicated::dedicated::server::sgx::activate',
            type: 'action',
          });

          return $state.go(
            'app.dedicated-server.server.dashboard.sgx.manage',
            {
              goBack: () =>
                $state.go(
                  'app.dedicated-server.server.dashboard.sgx.introduction',
                ),
              ...params,
            },
            transitionParams,
          );
        },
        breadcrumb: () => null,
      },
      atInternet: {
        rename: 'dedicated::dedicated::server::sgx',
      },
    },
  );
};

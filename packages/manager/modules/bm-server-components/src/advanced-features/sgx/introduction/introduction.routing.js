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
        sgxTrackingPrefix: /* @ngInject */ (serverType) =>
          `dedicated::dedicated::${serverType}::sgx`,
        goBack: /* @ngInject */ ($state) => (params = {}, transitionParams) =>
          $state.go(
            'app.dedicated-server.server.dashboard',
            params,
            transitionParams,
          ),
        goToManage: /* @ngInject */ ($state, atInternet, sgxTrackingPrefix) => (
          params = {},
          transitionParams,
        ) => {
          atInternet.trackClick({
            name: `${sgxTrackingPrefix}::activate`,
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
    },
  );
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-server.server.dashboard.sgx', {
    url: '/sgx',
    redirectTo: 'app.dedicated-server.server.dashboard.sgx.introduction',
    resolve: {
      breadcrumb: () => 'SGX',
      sgxTrackingPrefix: /* @ngInject */ (serverType) =>
        `dedicated::dedicated::${serverType}::sgx`,
    },
  });
};

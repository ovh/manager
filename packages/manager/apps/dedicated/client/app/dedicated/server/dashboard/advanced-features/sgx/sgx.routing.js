export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated.server.dashboard.sgx', {
    url: '/sgx',
    redirectTo: 'app.dedicated.server.dashboard.sgx.introduction',
  });
};

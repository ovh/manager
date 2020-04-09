export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.dashboard.organisation', {
    url: '/organisation',
    abstract: true,
  });
};

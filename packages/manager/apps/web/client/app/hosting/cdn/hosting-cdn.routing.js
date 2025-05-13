export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.cdn', {
    url: '/cdn',
    abstract: true,
  });
};

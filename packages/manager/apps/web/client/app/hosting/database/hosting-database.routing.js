export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.database', {
    url: '/database',
    abstract: true,
  });
};

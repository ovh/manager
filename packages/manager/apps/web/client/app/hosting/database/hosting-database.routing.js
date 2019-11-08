export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.database', {
    url: '/database',
    abstract: true,
  });
};

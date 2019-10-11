export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.cdn', {
    url: '/cdn',
    abstract: true,
  });
};

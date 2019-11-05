export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.sql-database', {
    url: '/sql-database',
    abstract: true,
  });
};

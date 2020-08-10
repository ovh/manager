export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database.dashboard.database.archive', {
    url: '/archive',
    abstract: true,
    template: '<div ui-view></div>',
  });
};

angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.dedicated', {
    template: '<div ui-view></div>',
    resolve: {
      breadcrumb: () => null,
    },
  });
});

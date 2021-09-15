angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.configuration', {
    url: '/configuration',
    component: 'ovhManagerConfiguration',
    translations: { value: ['../common'], format: 'json' },
    resolve: {
      hideBreadcrumb: () => true,
    },
  });
});

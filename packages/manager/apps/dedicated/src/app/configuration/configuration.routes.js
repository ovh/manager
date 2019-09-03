angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.configuration', {
    url: '/configuration',
    component: 'configuration',
    translations: { value: ['../common'], format: 'json' },
  });
});

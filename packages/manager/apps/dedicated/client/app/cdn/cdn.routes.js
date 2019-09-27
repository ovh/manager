angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.networks.cdn', {
    url: '',
    template: '<div data-ui-view></div>',
    abstract: true,
    reloadOnSearch: false,
  });
});

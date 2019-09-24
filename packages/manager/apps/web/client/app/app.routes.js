angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app', {
    abstract: true,
    url: '',
    controller: 'AppCtrl',
    controllerAs: 'AppCtrl',
    templateUrl: 'app.html',
    translations: { value: ['./core', './common'], format: 'json' },
    resolve: {
      user: /* @ngInject */ OvhApiMe => OvhApiMe.v6().get().$promise,
    },
  });

  $stateProvider.state('app.microsoft', {
    abstract: true,
    template: '<div ui-view></div>',
  });
});

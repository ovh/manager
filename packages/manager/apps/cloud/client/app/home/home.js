angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('home', {
    url: '/',
    templateUrl: 'app/home/home.html',
    controller: 'HomeCtrl',
    controllerAs: '$ctrl',
    translations: {
      value: ['.', '../common'],
      format: 'json',
    },
  });
});

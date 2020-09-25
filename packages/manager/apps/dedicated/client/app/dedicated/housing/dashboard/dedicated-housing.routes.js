angular.module('App').config(($stateProvider) => {
  $stateProvider.state('dedicated-housing.dashboard', {
    url: '/:productId',
    templateUrl: 'dedicated/housing/dashboard/dedicated-housing.html',
    controller: 'HousingCtrl',
    translations: { value: ['.'], format: 'json' },
  });
});

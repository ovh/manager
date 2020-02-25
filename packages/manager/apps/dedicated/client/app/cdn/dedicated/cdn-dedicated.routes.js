angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.networks.cdn.dedicated', {
    url: '/cdn/:productId',
    redirectTo: 'app.networks.cdn.dedicated.manage',
    views: {
      '': {
        templateUrl: 'cdn/dedicated/cdn-dedicated.html',
        controller: 'CdnCtrl',
      },
    },
  });
});

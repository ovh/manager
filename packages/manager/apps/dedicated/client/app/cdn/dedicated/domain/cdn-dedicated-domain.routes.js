angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.networks.cdn.dedicated.domain', {
    redirectTo: 'app.networks.cdn.dedicated.domain.statistics',
    url: '/domain/:domain',
    views: {
      cdnMainView: {
        templateUrl: 'cdn/dedicated/domain/cdn-dedicated-domain.html',
        controller: 'CdnDomainCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});

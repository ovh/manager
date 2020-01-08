angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.networks.cdn.dedicated.domain', {
    url: '/domain/:domain',
    views: {
      cdnMainView: {
        templateUrl: 'cdn/dedicated/domain/cdn-dedicated-domain.html',
        controller: 'CdnDomainCtrl',
        controllerAs: '$ctrl',
      },
      'cdnDomainView@app.networks.cdn.dedicated.domain': {
        templateUrl:
          'cdn/dedicated/domain/statistics/cdn-dedicated-domain-statistics.html',
        controller: 'CdnDomainStatisticsCtrl',
        controllerAs: '$ctrl',
      },
    },
    reloadOnSearch: false,
  });
});

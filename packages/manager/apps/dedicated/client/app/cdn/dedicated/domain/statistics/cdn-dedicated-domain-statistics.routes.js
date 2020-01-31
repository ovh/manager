angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.networks.cdn.dedicated.domain.statistics', {
    url: '/statistics',
    views: {
      cdnDomainView: {
        templateUrl:
          'cdn/dedicated/domain/statistics/cdn-dedicated-domain-statistics.html',
        controller: 'CdnDomainStatisticsCtrl',
        controllerAs: '$ctrl',
      },
      translations: { value: ['.'], format: 'json' },
    },
  });
});

angular
  .module('App')
  .config(($stateProvider) => {
    $stateProvider.state('app.networks.cdn.dedicated.manage.domain.dashboard', {
      redirectTo:
        'app.networks.cdn.dedicated.manage.domain.dashboard.statistics',
      url: '/:domain',
    views: {
        'cdnMainView@app.networks.cdn.dedicated': {
        templateUrl: 'cdn/dedicated/domain/cdn-dedicated-domain.html',
        controller: 'CdnDomainCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});

angular
  .module('App')
  .config(($stateProvider) => {
    $stateProvider.state(
      'app.networks.cdn.dedicated.manage.domain.dashboard.logs',
      {
    url: '/logs',
    views: {
      cdnDomainView: {
            templateUrl:
              'cdn/dedicated/domain/logs/cdn-dedicated-domain-logs.html',
        controller: 'CdnDomainTabLogsCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});

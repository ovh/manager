angular
  .module('App')
  .config(($stateProvider) => {
  $stateProvider.state('app.networks.cdn.dedicated.manage.logs', {
    url: '/logs',
    views: {
      cdnView: {
          templateUrl:
            'cdn/dedicated/manage/logs/cdn-dedicated-manage-logs.html',
        controller: 'CdnLogsCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});

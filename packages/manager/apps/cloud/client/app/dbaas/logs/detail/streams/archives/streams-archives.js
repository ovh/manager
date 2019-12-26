angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('dbaas.logs.detail.streams.archives', {
    url: '/:streamId/archives',
    views: {
      logsStreams: {
        templateUrl:
          'app/dbaas/logs/detail/streams/archives/streams-archives.html',
        controller: 'LogsStreamsArchivesCtrl',
        controllerAs: 'ctrl',
      },
    },
  });
});

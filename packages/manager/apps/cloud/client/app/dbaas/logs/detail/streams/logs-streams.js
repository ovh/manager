angular.module('managerApp').config(($stateProvider) => {
  $stateProvider
    .state('dbaas.logs.detail.streams', {
      url: '/streams',
      redirectTo: 'dbaas.logs.detail.streams.home',
      views: {
        logsContent: {
          templateUrl: 'app/dbaas/logs/detail/streams/logs-streams.html',
          controller: 'LogsStreamsCtrl',
          controllerAs: 'ctrl',
        },
      },
    })
    .state('dbaas.logs.detail.streams.home', {
      url: '/home',
      views: {
        logsStreams: {
          templateUrl:
            'app/dbaas/logs/detail/streams/home/logs-streams-home.html',
          controller: 'LogsStreamsHomeCtrl',
          controllerAs: 'ctrl',
        },
      },
    })
    .state('dbaas.logs.detail.streams.add', {
      url: '/add',
      views: {
        logsStreams: {
          templateUrl:
            'app/dbaas/logs/detail/streams/add/logs-streams-add.html',
          controller: 'LogsStreamsAddCtrl',
          controllerAs: 'ctrl',
        },
      },
    })
    .state('dbaas.logs.detail.streams.edit', {
      url: '/:streamId',
      views: {
        logsStreams: {
          templateUrl:
            'app/dbaas/logs/detail/streams/add/logs-streams-add.html',
          controller: 'LogsStreamsAddCtrl',
          controllerAs: 'ctrl',
        },
      },
    })
    .state('dbaas.logs.detail.streams.follow', {
      url: '/:streamId/follow',
      views: {
        logsStreams: {
          templateUrl:
            'app/dbaas/logs/detail/streams/follow/streams-follow.html',
          controller: 'LogsStreamsFollowCtrl',
          controllerAs: 'ctrl',
        },
      },
    });
});

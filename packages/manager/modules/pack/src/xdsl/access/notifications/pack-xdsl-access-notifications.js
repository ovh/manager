angular.module('managerApp')
  .config(($stateProvider) => {
    $stateProvider
      .state('telecom.pack.xdsl.access-notifications', {
        url: '/notifications',
        views: {
          'accessView@telecom.pack.xdsl': {
            controller: 'XdslAccessNotificationCtrl',
            controllerAs: 'XdslNotifications',
            templateUrl: 'app/telecom/pack/xdsl/access/notifications/pack-xdsl-access-notifications.html',
          },
        },
        translations: ['..', '.'],
      });
  });

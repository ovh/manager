angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.xdsl.line.access-notifications', {
    url: '/notifications',
    views: {
      'accessView@telecom.packs.pack.xdsl.line': {
        controller: 'XdslAccessNotificationCtrl',
        controllerAs: 'XdslNotifications',
        templateUrl:
          'app/telecom/pack/xdsl/access/notifications/pack-xdsl-access-notifications.html',
      },
    },
    translations: { value: ['..', '.'], format: 'json' },
  });
});

angular
  .module('managerApp')
  .config(($stateProvider) => {
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
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('notification_breadcrumb'),
      },
      translations: { value: ['..'], format: 'json' },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);

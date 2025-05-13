import controller from './notifications.controller';
import template from './notifications.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.xdsl.line.access-notifications', {
    url: '/notifications',
    views: {
      'accessView@telecom.packs.pack.xdsl.line': {
        controller,
        controllerAs: 'XdslNotifications',
        template,
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('notification_breadcrumb'),
    },
  });
};

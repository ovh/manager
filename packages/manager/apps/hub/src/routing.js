import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';

export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('app', {
    url: '/',
    componentProvider: /* @ngInject */ (services) =>
      services.count === 0 ? 'hubOrderDashboard' : 'hubDashboard',
    resolve: {
      bills: /* @ngInject */ (hub) => hub.data.bills,
      catalog: /* @ngInject */ (hub) =>
        groupBy(hub.data.catalog.data, 'universe'),
      hub: /* @ngInject */ ($http) =>
        $http
          .get('/hub', {
            serviceType: 'aapi',
          })
          .then(({ data }) => data),
      me: /* @ngInject */ (hub) => hub.data.me.data,
      notifications: /* @ngInject */ ($translate, hub) =>
        map(
          filter(hub.data.notifications.data, (notification) =>
            ['warning', 'error'].includes(notification.level),
          ),
          (notification) => ({
            ...notification,
            // force sanitization to null as this causes issues with UTF-8 characters
            description: $translate.instant(
              'manager_hub_notification_warning',
              { content: notification.description },
              undefined,
              false,
              null,
            ),
          }),
        ),
      services: /* @ngInject */ (hub) => hub.data.services.data,
    },
  });

  $urlRouterProvider.otherwise('/');
};

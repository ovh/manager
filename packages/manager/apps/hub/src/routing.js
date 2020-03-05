import filter from 'lodash/filter';
import head from 'lodash/head';
import map from 'lodash/map';
import { BillingService } from '@ovh-ux/manager-models';

export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('app', {
    url: '',
    abstract: true,
    redirectTo: 'app.dashboard',
    resolve: {
      bills: /* @ngInject */ (hub) => hub.data.bills,
      catalog: /* @ngInject */ (hub) => hub.data.catalog,
      hub: /* @ngInject */ ($http) =>
        $http
          .get('/hub', {
            serviceType: 'aapi',
          })
          .then(({ data }) => data),
      me: /* @ngInject */ (hub) => hub.data.me.data,
      billingServices: /* @ngInject */ (hub) => ({
        count: hub.data.billingServices.data.count,
        data: map(
          hub.data.billingServices.data.data,
          (service) => new BillingService(service),
        ),
      }),
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
      order: /* @ngInject */ ($q, hub, OrderTracking) => {
        const lastOrder = hub.data.lastOrder.data;
        return lastOrder
          ? $q
              .all({
                status: OrderTracking.getOrderStatus(lastOrder),
                details: OrderTracking.getOrderDetails(lastOrder),
              })
              .then(({ status, details }) => ({
                ...lastOrder,
                status,
                ...head(details),
              }))
              .then((order) =>
                OrderTracking.getCompleteHistory(order).then((history) => ({
                  ...order,
                  ...history,
                })),
              )
          : $q.resolve();
      },

      services: /* @ngInject */ (hub) => hub.data.services.data,
      trackingPrefix: () => 'hub::dashboard::activity::payment-status',
    },
  });

  $urlRouterProvider.otherwise('/');
};

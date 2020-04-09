import filter from 'lodash/filter';
import get from 'lodash/get';
import head from 'lodash/head';
import map from 'lodash/map';
import { BillingService, User } from '@ovh-ux/manager-models';
import mapValues from 'lodash/mapValues';
import set from 'lodash/set';

import { BILLING_REDIRECTIONS } from './constants';

const parseErrors = (data) =>
  mapValues(data.data, (value) =>
    value.status === 'ERROR'
      ? {
          status: value.status,
          error: value.data,
        }
      : value,
  );

const transformBillingServices = (services) => {
  return services.error
    ? services
    : {
        count: get(services, 'data.count'),
        data: map(services.data.data, (service) => new BillingService(service)),
      };
};

const transformOrder = ($q, lastOrder, OrderTracking) => {
  const latestOrder = lastOrder.data;
  return latestOrder
    ? $q
        .all({
          status: OrderTracking.getOrderStatus(latestOrder),
          details: OrderTracking.getOrderDetails(latestOrder),
        })
        .then(({ status, details }) => ({
          ...latestOrder,
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
};

export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('app', {
    url: '',
    abstract: true,
    redirectTo: 'app.dashboard',
    resolve: {
      sidebar: /* @ngInject */ ($rootScope) => {
        $rootScope.$broadcast('sidebar:loaded');
      },
      billingServices: /* @ngInject */ (hub) =>
        transformBillingServices(hub.billingServices),
      refreshBillingServices: /* @ngInject */ (refresh) => () =>
        refresh('billingServices').then((billingServices) =>
          transformBillingServices(billingServices),
        ),
      bills: /* @ngInject */ (hub) => hub.bills,
      catalog: /* @ngInject */ (hub) => hub.catalog,
      certificates: /* @ngInject */ (hub) => hub.certificates.data,
      me: /* @ngInject */ (certificates, hub) =>
        new User(hub.me.data, certificates),
      notifications: /* @ngInject */ ($translate, hub) =>
        map(
          filter(hub.notifications.data, (notification) =>
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
      order: /* @ngInject */ ($q, hub, OrderTracking) =>
        transformOrder($q, hub.lastOrder, OrderTracking),
      refreshOrder: /* @ngInject */ (refresh) => () =>
        refresh('lastOrder').then((lastOrder) => transformOrder(lastOrder)),
      services: /* @ngInject */ (hub) => hub.services,

      hub: /* @ngInject */ ($http) =>
        $http
          .get('/hub', {
            serviceType: 'aapi',
          })
          .then(({ data }) => parseErrors(data)),

      trackingPrefix: () => 'hub::dashboard::activity::payment-status',
      feedbackUrl: /* @ngInject */ (hub) => hub.survey,

      refresh: /* @ngInject */ ($http) => (type) =>
        $http
          .get(`/hub/${type}`, {
            serviceType: 'aapi',
          })
          .then(({ data }) => parseErrors(data)),
    },
  });

  BILLING_REDIRECTIONS.map((url) =>
    $urlRouterProvider.when(
      url,
      /* @ngInject */ ($location, $window, CORE_MANAGER_URLS) => {
        set(
          $window,
          'location',
          `${CORE_MANAGER_URLS.dedicated}/#${$location.url()}`,
        );
      },
    ),
  );

  $urlRouterProvider.otherwise('/');
};

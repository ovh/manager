import { listRouting } from '../ip.routing';

import controller from './ip-ip.controller';
import template from './ip-ip.html';

import { TRACKING_PREFIX } from '../ip.constant';
import { DASHBOARD_TRACKING_PREFIX, IP_SERVICE_TYPE } from './ip-ip.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('app.ip.dashboard', {
      ...listRouting,
      url: '',
      controller,
      template,
      redirectTo: (transition) =>
        transition
          .injector()
          .getAsync('hasAnyIp')
          .then((hasAnyIp) => (hasAnyIp ? false : 'app.ip.onboarding')),
      resolve: {
        ...listRouting.resolve,
        trackingData: () => ({
          prefix: DASHBOARD_TRACKING_PREFIX.DEFAULT,
          filtersPrefix: DASHBOARD_TRACKING_PREFIX.FILTERS,
        }),
      },
      atInternet: {
        rename: `${TRACKING_PREFIX}::${DASHBOARD_TRACKING_PREFIX.DEFAULT}`,
        level2: 57,
      },
    })
    .state('app.ip.dashboard.terminate', {
      url: '/terminate/:id',
      views: {
        modal: {
          component: 'billingAutorenewTerminateAgoraService',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        serviceType: () => IP_SERVICE_TYPE,
        serviceInfos: /* @ngInject */ ($transition$, Ip) =>
          Ip.getIpServiceInfos($transition$.params().id),
        id: /* @ngInject */ (serviceInfos) => serviceInfos.serviceId,
        serviceName: /* @ngInject */ (serviceInfos) => serviceInfos.serviceName,
        goBack: /* @ngInject */ ($state, Alerter, $translate) => (message) => {
          const promise = $state.go('app.ip.dashboard').then(() => {
            if (message) {
              Alerter.alertFromSWS($translate.instant(message));
            }
          });
          return promise;
        },
      },
    });
};

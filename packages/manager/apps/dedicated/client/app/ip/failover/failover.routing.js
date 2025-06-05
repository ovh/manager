import { listRouting } from '../ip.routing';

import { TRACKING_PREFIX } from '../ip.constant';
import {
  FAILOVER_SERVICE_TYPE,
  FAILOVER_TRACKING_PREFIX,
} from './failover.constants';
import { BADGE_BYOIP } from '../components/list/list.constant';
import { IP_SERVICE_TYPE } from '../ip/ip-ip.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('app.ip.failover', {
      ...listRouting,
      url: '/failover?unused',
      params: {
        unused: { inherit: false, value: '0' },
      },
      component: 'ipFailover',
      resolve: {
        ...listRouting.resolve,
        badges: () => [BADGE_BYOIP],
        trackingData: () => ({
          prefix: FAILOVER_TRACKING_PREFIX.DEFAULT,
          filtersPrefix: FAILOVER_TRACKING_PREFIX.FILTERS,
        }),
        serviceType: () => FAILOVER_SERVICE_TYPE,
        unusedFilter: /* @ngInject */ ($transition$) =>
          $transition$.params().unused?.toString() === '1',
        goToDeleteIpService: /* @ngInject */ ($state) => (ipBlock) => {
          $state.go('app.ip.failover.terminate', { id: ipBlock });
        },
      },
      atInternet: {
        rename: `${TRACKING_PREFIX}::${FAILOVER_TRACKING_PREFIX.DEFAULT}`,
      },
    })
    .state('app.ip.failover.terminate', {
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
          const promise = $state.go('app.ip.failover').then(() => {
            if (message) {
              Alerter.alertFromSWS($translate.instant(message));
            }
          });
          return promise;
        },
      },
    });
};

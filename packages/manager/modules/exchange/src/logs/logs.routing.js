import { name } from './live-tail/live-tail.component';
import {
  EXCHANGE_LOG_KINDS_KEYS,
  EXCHANGE_LOGS_TRACKING_HITS,
} from './logs.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.logs', {
    url: '/logs',
    atInternet: {
      rename: EXCHANGE_LOGS_TRACKING_HITS.LOGS_PAGE,
    },
    params: {
      kind: null,
    },
    redirectTo: false,
    component: name,
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('exchange_tab_LOGS'),
      trackClick: /* @ngInject */ (atInternet) => (hit) => {
        atInternet.trackClick({
          name: hit,
          type: 'action',
        });
      },
      logsAvailability: () => true,
      trackingHits: () => EXCHANGE_LOGS_TRACKING_HITS,
      url: /* @ngInject */ (organization, productId) => {
        const baseLogsUrl = `/email/exchange/${organization}/service/${productId}/log`;
        return {
          LOG: `${baseLogsUrl}/url`,
          LOG_SUSBSCRIPTION: `${baseLogsUrl}/subscription`,
        };
      },
      apiVersion: /* @ngInject */ (API_VERSION) => API_VERSION.v1,
      kind: /* @ngInject */ (logKinds, $transition$) =>
        $transition$.params().kind || logKinds[0],
      description: /* @ngInject */ ($translate) =>
        $translate.instant('exchange_logs_description'),
      goToListingPage: /* @ngInject */ ($state, $transition$) => (params) =>
        $state.go('exchange.dashboard.logs.data-streams', {
          ...$transition$.params(),
          ...params,
        }),
      logKinds: /* @ngInject */ (
        exchangeLogsService,
        organization,
        productId,
      ) => exchangeLogsService.getLogKinds(organization, productId),
      logKindsKeys: /* @ngInject */ (logKinds) =>
        Object.fromEntries(
          logKinds.map((kind) => [kind, EXCHANGE_LOG_KINDS_KEYS]),
        ),
    },
  });
};

import { name } from './live-tail/live-tail.component';
import {
  XDSL_LOG_KEYS,
  XDSL_LOGS_TRACKING_HITS,
  LOGS_TRACKING_CONTEXT,
} from './logs.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.xdsl.line.logs', {
    url: '/logs',
    atInternet: {
      rename: XDSL_LOGS_TRACKING_HITS.LOGS_PAGE,
      ...LOGS_TRACKING_CONTEXT,
    },
    params: {
      kind: null,
    },
    redirectTo: false,
    views: {
      'xdslView@telecom.packs.pack.xdsl.line': name,
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('isp_xdsl_logs'),
      trackClick: /* @ngInject */ (atInternet) => (hit) => {
        atInternet.trackClick({
          name: hit,
          type: 'action',
          ...LOGS_TRACKING_CONTEXT,
        });
      },
      trackingHits: () => XDSL_LOGS_TRACKING_HITS,
      url: /* @ngInject */ (serviceName) => {
        const baseLogsUrl = `/xdsl/${serviceName}/log`;
        return {
          LOG: `${baseLogsUrl}/url`,
          LOG_SUSBSCRIPTION: `${baseLogsUrl}/subscription`,
        };
      },
      apiVersion: /* @ngInject */ (API_VERSION) => API_VERSION.v1,
      kind: /* @ngInject */ (logKinds, $transition$) =>
        $transition$.params().kind || logKinds[0],
      description: /* @ngInject */ ($translate) =>
        $translate.instant('isp_xdsl_logs_description'),
      goToListingPage: /* @ngInject */ ($state, $transition$) => (params) =>
        $state.go('telecom.packs.pack.xdsl.line.logs.data-streams', {
          ...$transition$.params(),
          ...params,
        }),
      logKinds: /* @ngInject */ (xdslLogsService, serviceName) =>
        xdslLogsService.getLogKinds(serviceName),
      logKindsKeys: /* @ngInject */ (logKinds) =>
        Object.fromEntries(logKinds.map((kind) => [kind, XDSL_LOG_KEYS])),
      logServiceGuideLink: /* @ngInject */ (user, DATA_PLATFORM_GUIDE) =>
        DATA_PLATFORM_GUIDE[user.ovhSubsidiary] ?? DATA_PLATFORM_GUIDE.WE,
    },
  });
};

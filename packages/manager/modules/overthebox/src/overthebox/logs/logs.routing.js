import { name } from './live-tail/live-tail.component';
import {
  OTB_LOG_KEYS,
  OTB_LOGS_TRACKING_HITS,
  LOGS_TRACKING_CONTEXT,
} from './logs.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('overTheBoxes.overTheBox.logs', {
    url: '/logs',
    atInternet: {
      rename: OTB_LOGS_TRACKING_HITS.LOGS_PAGE,
      ...LOGS_TRACKING_CONTEXT,
    },
    params: {
      kind: null,
    },
    redirectTo: false,
    views: {
      otbView: name,
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('overTheBox_logs'),
      trackClick: /* @ngInject */ (atInternet) => (hit) => {
        atInternet.trackClick({
          name: hit,
          type: 'action',
          ...LOGS_TRACKING_CONTEXT,
        });
      },
      trackingHits: () => OTB_LOG_KEYS,
      url: /* @ngInject */ (serviceName) => {
        const baseLogsUrl = `/overTheBox/${serviceName}/log`;
        return {
          LOG: `${baseLogsUrl}/url`,
          LOG_SUSBSCRIPTION: `${baseLogsUrl}/subscription`,
        };
      },
      apiVersion: /* @ngInject */ (API_VERSION) => API_VERSION.v1,
      kind: /* @ngInject */ (logKinds, $transition$) =>
        $transition$.params().kind || logKinds[0],
      description: /* @ngInject */ ($translate) =>
        $translate.instant('overTheBox_logs_description'),
      goToListingPage: /* @ngInject */ ($state, $transition$) => (params) =>
        $state.go('overTheBoxes.overTheBox.logs.data-streams', {
          ...$transition$.params(),
          ...params,
        }),
      logKinds: /* @ngInject */ (overTheBoxLogsService, serviceName) =>
        overTheBoxLogsService.getLogKinds(serviceName),
      logKindsKeys: /* @ngInject */ (logKinds) =>
        Object.fromEntries(logKinds.map((kind) => [kind, OTB_LOG_KEYS])),
      logServiceGuideLink: /* @ngInject */ (coreConfig, DATA_PLATFORM_GUIDE) =>
        DATA_PLATFORM_GUIDE[coreConfig.getUser().ovhSubsidiary] ??
        DATA_PLATFORM_GUIDE.WE,
    },
  });
};

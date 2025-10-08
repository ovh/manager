import { name } from './live-tail/live-tail.component';
import {
  CLOUD_CONNECT_LOG_KEYS,
  CLOUD_CONNECT_LOGS_GUIDE,
  CLOUD_CONNECT_LOGS_TRACKING_HITS,
  LOGS_TRACKING_CONTEXT,
} from './logs.constants';

const redirectTo = (transition) =>
  transition
    .injector()
    .getAsync('isLogsAvailable')
    .then((isLogsAvailable) =>
      !isLogsAvailable ? 'cloud-connect.details.home' : false,
    );

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.details.logs', {
    url: '/logs',
    atInternet: {
      rename: CLOUD_CONNECT_LOGS_TRACKING_HITS.LOGS_PAGE,
      ...LOGS_TRACKING_CONTEXT,
    },
    params: {
      kind: null,
    },
    redirectTo,
    component: name,
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('cloud_connect_logs'),
      trackClick: /* @ngInject */ (atInternet) => (hit) => {
        atInternet.trackClick({
          name: hit,
          type: 'action',
          ...LOGS_TRACKING_CONTEXT,
        });
      },
      trackingHits: () => CLOUD_CONNECT_LOGS_TRACKING_HITS,
      url: /* @ngInject */ (cloudConnectId) => {
        const baseLogsUrl = `/ovhCloudConnect/${cloudConnectId}/log`;
        return {
          LOG: `${baseLogsUrl}/url`,
          LOG_SUSBSCRIPTION: `${baseLogsUrl}/subscription`,
        };
      },
      apiVersion: /* @ngInject */ (API_VERSION) => API_VERSION.v1,
      kind: /* @ngInject */ (logKinds, $transition$) =>
        $transition$.params().kind || logKinds[0],
      description: /* @ngInject */ ($translate) =>
        $translate.instant('cloud_connect_logs_description'),
      goToListingPage: /* @ngInject */ ($state, $transition$) => (params) =>
        $state.go('cloud-connect.details.logs.data-streams', {
          ...$transition$.params(),
          ...params,
        }),
      logKinds: /* @ngInject */ (cloudConnectLogsService, cloudConnectId) =>
        cloudConnectLogsService.getLogKinds(cloudConnectId),
      logKindsKeys: /* @ngInject */ (logKinds) =>
        Object.fromEntries(
          logKinds.map((kind) => [kind, CLOUD_CONNECT_LOG_KEYS]),
        ),
      logServiceGuideLink: /* @ngInject */ (user) =>
        CLOUD_CONNECT_LOGS_GUIDE[user.ovhSubsidiary] ??
        CLOUD_CONNECT_LOGS_GUIDE.WE,
    },
  });
};

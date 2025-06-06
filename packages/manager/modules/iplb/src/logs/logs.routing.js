import { name } from './live-tail/live-tail.component';
import { FEATURES } from '../iplb.constants';
import IplbHeaderTemplate from '../header/iplb-dashboard-header.html';
import { IPLB_LOGS_TRACKING_HITS } from './logs.constants';

const redirectTo = (transition) =>
  transition
    .injector()
    .getAsync('logsAvailability')
    .then((logsAvailability) =>
      !logsAvailability ? 'iplb.detail.home' : false,
    );

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iplb.detail.logs', {
    url: '/logs',
    atInternet: {
      rename: IPLB_LOGS_TRACKING_HITS.LOGS_PAGE,
    },
    params: {
      kind: null,
    },
    redirectTo,
    views: {
      iplbHeader: {
        template: IplbHeaderTemplate,
        controller: 'IpLoadBalancerDashboardHeaderCtrl',
        controllerAs: 'ctrl',
      },
      iplbContent: name,
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('iplb_tab_logs'),
      trackClick: /* @ngInject */ (atInternet) => (hit) => {
        atInternet.trackClick({
          name: hit,
          type: 'action',
        });
      },
      logsAvailability: /* @ngInject */ (features) =>
        features.isFeatureAvailable(FEATURES.LOGS),
      trackingHits: () => IPLB_LOGS_TRACKING_HITS,
      url: /* @ngInject */ (serviceName) => {
        const baseLogsUrl = `/ipLoadbalancing/${serviceName}/log`;
        return {
          LOG: `${baseLogsUrl}/url`,
          LOG_SUSBSCRIPTION: `${baseLogsUrl}/subscription`,
        };
      },
      apiVersion: /* @ngInject */ (API_VERSION) => API_VERSION.v1,
      kind: /* @ngInject */ (logKinds, $transition$) =>
        $transition$.params().kind || logKinds[0],
      description: /* @ngInject */ ($translate) =>
        $translate.instant('iplb_logs_description'),
      goToListingPage: /* @ngInject */ ($state, $transition$) => (params) =>
        $state.go('iplb.detail.logs.data-streams', {
          ...$transition$.params(),
          ...params,
        }),
      logKinds: /* @ngInject */ (iplbLogsService, serviceName) =>
        iplbLogsService.getLogKinds(serviceName),
    },
  });
};

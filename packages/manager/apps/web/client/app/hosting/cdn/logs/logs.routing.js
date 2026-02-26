import template from './logs.html';
import controller from './logs.controller';
import {
  CDN_HOSTING_LOG_KEYS,
  CDN_HOSTING_LOGS_TRACKING_HITS,
  LOGS_TRACKING_CONTEXT,
} from './logs.constants';

const redirectTo = (transition) =>
  transition
    .injector()
    .getAsync('logKinds')
    .then((logKinds) =>
      !logKinds || logKinds.length === 0 ? 'app.hosting.dashboard.cdn' : false,
    );

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.cdn.logs', {
    url: '/logs',
    views: {
      'cdnView@app.hosting.dashboard.cdn': {
        template,
        controller,
        controllerAs: '$ctrl',
      },
    },
    atInternet: {
      rename: CDN_HOSTING_LOGS_TRACKING_HITS.LOGS_PAGE,
      ...LOGS_TRACKING_CONTEXT,
    },
    params: {
      kind: null,
    },
    redirectTo,
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('cdn_logs'),
      trackClick: /* @ngInject */ (atInternet) => (hit) => {
        atInternet.trackClick({
          name: hit,
          type: 'action',
          ...LOGS_TRACKING_CONTEXT,
        });
      },
      trackingHits: () => CDN_HOSTING_LOGS_TRACKING_HITS,
      url: /* @ngInject */ ($stateParams) => {
        const baseLogsUrl = `/hosting/web/${$stateParams.productId}/cdn/log`;
        return {
          LOG: `${baseLogsUrl}/url`,
          LOG_SUBSCRIPTION: `${baseLogsUrl}/subscription`,
        };
      },
      apiVersion: /* @ngInject */ (API_VERSION) => API_VERSION.v1,
      kind: /* @ngInject */ (logKinds, $transition$) =>
        $transition$.params().kind || logKinds[0],
      description: /* @ngInject */ ($translate) =>
        $translate.instant('cdn_logs_description'),
      goToListingPage: /* @ngInject */ ($state, $transition$) => (params) =>
        $state.go('app.hosting.dashboard.cdn.logs.data-streams', {
          ...$transition$.params(),
          ...params,
        }),
      logKinds: /* @ngInject */ (hostingCdnLogsService) =>
        hostingCdnLogsService.getLogKinds().catch(() => []),
      logKindsKeys: /* @ngInject */ (logKinds) =>
        Object.fromEntries(
          logKinds.map((kind) => [kind, CDN_HOSTING_LOG_KEYS]),
        ),
      logServiceGuideLink: /* @ngInject */ (coreConfig, DATA_PLATFORM_GUIDE) =>
        DATA_PLATFORM_GUIDE[coreConfig.getUser().ovhSubsidiary] ??
        DATA_PLATFORM_GUIDE.WE,
    },
  });
};

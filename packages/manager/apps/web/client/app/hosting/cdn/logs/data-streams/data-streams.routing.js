import template from './data-streams.template.html';
import controller from './data-streams.controller';
import {
  CDN_HOSTING_DATA_STREAMS_TRACKING_HITS,
  LOGS_TRACKING_CONTEXT,
} from '../logs.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.cdn.logs.data-streams', {
    url: '/data-streams',
    params: {
      kind: null,
    },
    views: {
      'cdnView@app.hosting.dashboard.cdn': {
        template,
        controller,
        controllerAs: '$ctrl',
      },
    },
    atInternet: {
      rename: CDN_HOSTING_DATA_STREAMS_TRACKING_HITS.LISTING_PAGE,
      ...LOGS_TRACKING_CONTEXT,
    },
    resolve: {
      breadcrumb: () => null,
      url: /* @ngInject */ ($stateParams) =>
        `/hosting/web/${$stateParams.productId}/cdn/log/subscription`,
      trackingHits: () => CDN_HOSTING_DATA_STREAMS_TRACKING_HITS,
      kind: /* @ngInject */ ($transition$) => $transition$.params().kind,
      logSubscriptionApiData: /* @ngInject */ (url, kind) => ({
        url,
        params: { kind },
      }),
      goBack: /* @ngInject  */ ($state, trackClick) => (kind) => {
        trackClick(CDN_HOSTING_DATA_STREAMS_TRACKING_HITS.GO_BACK);
        return $state.go(
          'app.hosting.dashboard.cdn.logs',
          { kind },
          { reload: true },
        );
      },
    },
  });
};

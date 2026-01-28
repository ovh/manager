import template from './data-streams.template.html';
import controller from './data-streams.controller';
import {
  CDN_DEDICATED_DATA_STREAMS_TRACKING_HITS,
  LOGS_TRACKING_CONTEXT,
} from '../logs.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.networks.cdn.dedicated.manage.logs.data-streams', {
    url: '/data-streams',
    params: {
      kind: null,
    },
    views: {
      'cdnView@app.networks.cdn.dedicated.manage': {
        template,
        controller,
        controllerAs: '$ctrl',
      },
    },
    atInternet: {
      rename: CDN_DEDICATED_DATA_STREAMS_TRACKING_HITS.LISTING_PAGE,
      ...LOGS_TRACKING_CONTEXT,
    },
    resolve: {
      breadcrumb: () => null,
      url: /* @ngInject */ ($stateParams) =>
        `/cdn/dedicated/${$stateParams.productId}/log/subscription`,
      trackingHits: () => CDN_DEDICATED_DATA_STREAMS_TRACKING_HITS,
      kind: /* @ngInject */ ($transition$) => $transition$.params().kind,
      logSubscriptionApiData: /* @ngInject */ (url, kind) => ({
        url,
        params: { kind },
      }),
      goBack: /* @ngInject  */ ($state, trackClick) => (kind) => {
        trackClick(CDN_DEDICATED_DATA_STREAMS_TRACKING_HITS.GO_BACK);
        return $state.go(
          'app.networks.cdn.dedicated.manage.logs',
          { kind },
          { reload: true },
        );
      },
    },
  });
};

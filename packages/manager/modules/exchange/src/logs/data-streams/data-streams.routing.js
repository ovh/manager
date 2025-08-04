import { EXCHANGE_DATA_STREAMS_TRACKING_HITS } from '../logs.constants';
import { name } from './data-streams.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.logs.data-streams', {
    url: '',
    params: {
      kind: null,
    },
    views: {
      '@exchange.dashboard': name,
    },
    atInternet: {
      rename: EXCHANGE_DATA_STREAMS_TRACKING_HITS.LISTING_PAGE,
    },
    resolve: {
      breadcrumb: () => null,

      url: /* @ngInject */ (organization, productId) =>
        `/email/exchange/${organization}/service/${productId}/log/subscription`,
      trackingHits: () => EXCHANGE_DATA_STREAMS_TRACKING_HITS,
      kind: /* @ngInject */ ($transition$) => $transition$.params().kind,
      goBack: /* @ngInject  */ ($state, trackClick) => (kind) => {
        trackClick(EXCHANGE_DATA_STREAMS_TRACKING_HITS.GO_BACK);
        return $state.go('exchange.dashboard.logs', { kind }, { reload: true });
      },
    },
  });
};

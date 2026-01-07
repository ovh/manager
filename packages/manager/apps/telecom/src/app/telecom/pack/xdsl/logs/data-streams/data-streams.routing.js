import {
  XDSL_DATA_STREAMS_TRACKING_HITS,
  LOGS_TRACKING_CONTEXT,
} from '../logs.constants';
import { name } from './data-streams.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.xdsl.line.logs.data-streams', {
    url: '',
    params: {
      kind: null,
    },
    views: {
      'xdslView@telecom.packs.pack.xdsl.line': name,
    },
    atInternet: {
      rename: XDSL_DATA_STREAMS_TRACKING_HITS.LISTING_PAGE,
      ...LOGS_TRACKING_CONTEXT,
    },
    resolve: {
      breadcrumb: () => null,
      url: /* @ngInject */ (serviceName) =>
        `/xdsl/${serviceName}/log/subscription`,
      trackingHits: () => XDSL_DATA_STREAMS_TRACKING_HITS,
      kind: /* @ngInject */ ($transition$) => $transition$.params().kind,
      logSubscriptionApiData: /* @ngInject */ (url, kind) => ({
        url,
        params: { kind },
      }),
      goBack: /* @ngInject  */ ($state, trackClick) => (kind) => {
        trackClick(XDSL_DATA_STREAMS_TRACKING_HITS.GO_BACK);
        return $state.go(
          'telecom.packs.pack.xdsl.line.logs',
          { kind },
          { reload: true },
        );
      },
    },
  });
};

import {
  CLOUD_CONNECT_DATA_STREAMS_TRACKING_HITS,
  LOGS_TRACKING_CONTEXT,
} from '../logs.constants';
import { name } from './data-streams.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.details.logs.data-streams', {
    url: '',
    params: {
      kind: null,
    },
    views: {
      '@cloud-connect.details': name,
    },
    atInternet: {
      rename: CLOUD_CONNECT_DATA_STREAMS_TRACKING_HITS.LISTING_PAGE,
      ...LOGS_TRACKING_CONTEXT,
    },
    resolve: {
      breadcrumb: () => null,
      url: /* @ngInject */ (cloudConnectId) =>
        `/ovhCloudConnect/${cloudConnectId}/log/subscription`,
      trackingHits: () => CLOUD_CONNECT_DATA_STREAMS_TRACKING_HITS,
      kind: /* @ngInject */ ($transition$) => $transition$.params().kind,
      logSubscriptionApiData: /* @ngInject */ (url, kind) => ({
        url,
        params: { kind },
      }),
      goBack: /* @ngInject  */ ($state, trackClick) => (kind) => {
        trackClick(CLOUD_CONNECT_DATA_STREAMS_TRACKING_HITS.GO_BACK);
        return $state.go(
          'cloud-connect.details.logs',
          { kind },
          { reload: true },
        );
      },
    },
  });
};

import {
  OTB_DATA_STREAMS_TRACKING_HITS,
  LOGS_TRACKING_CONTEXT,
} from '../logs.constants';
import { name } from './data-streams.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('overTheBoxes.overTheBox.logs.data-streams', {
    url: '',
    params: {
      kind: null,
    },
    views: {
      '@overTheBoxes': name,
    },
    atInternet: {
      rename: OTB_DATA_STREAMS_TRACKING_HITS.LISTING_PAGE,
      ...LOGS_TRACKING_CONTEXT,
    },
    resolve: {
      breadcrumb: () => null,
      url: /* @ngInject */ (serviceName) =>
        `/overTheBox/${serviceName}/log/subscription`,
      trackingHits: () => OTB_DATA_STREAMS_TRACKING_HITS,
      kind: /* @ngInject */ ($transition$) => $transition$.params().kind,
      logSubscriptionApiData: /* @ngInject */ (url, kind) => ({
        url,
        params: { kind },
      }),
      goBack: /* @ngInject  */ ($state, trackClick) => (kind) => {
        trackClick(OTB_DATA_STREAMS_TRACKING_HITS.GO_BACK);
        return $state.go(
          'overTheBoxes.overTheBox.logs',
          { kind },
          { reload: true },
        );
      },
    },
  });
};

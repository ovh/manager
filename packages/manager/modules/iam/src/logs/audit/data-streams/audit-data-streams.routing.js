import { IAM_DATA_STREAMS_TRACKING_HITS } from '../../logs.constants';
import { name } from '../../../components/logs/data-streams/data-streams.component';
import { URL } from '../audit-logs.service';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.logs.audit.data-streams', {
    url: '',
    params: {
      kind: null,
    },
    views: {
      'logsView@iam.logs': name,
    },
    atInternet: {
      rename: IAM_DATA_STREAMS_TRACKING_HITS.AUDIT.LISTING_PAGE,
    },
    resolve: {
      breadcrumb: () => null,
      url: () => URL.LOG_SUSBSCRIPTION,
      trackingHits: () => IAM_DATA_STREAMS_TRACKING_HITS.AUDIT,
      kind: /* @ngInject */ ($transition$) => $transition$.params().kind,
      goBack: /* @ngInject  */ ($state, kind, trackClick) => () => {
        trackClick(IAM_DATA_STREAMS_TRACKING_HITS.AUDIT.GO_BACK);
        return $state.go('iam.logs.audit', { kind }, { reload: true });
      },
    },
  });
};

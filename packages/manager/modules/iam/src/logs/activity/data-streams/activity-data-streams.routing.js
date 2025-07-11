import { IAM_DATA_STREAMS_TRACKING_HITS } from '../../logs.constants';
import { name } from '../../../components/logs/data-streams/data-streams.component';
import { URL } from '../activity-logs.service';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.logs.activity.data-streams', {
    url: '',
    params: {
      kind: null,
    },
    views: {
      'logsView@iam.logs': name,
    },
    atInternet: {
      rename: IAM_DATA_STREAMS_TRACKING_HITS.ACTIVITY.LISTING_PAGE,
    },
    resolve: {
      breadcrumb: () => null,
      url: () => URL.LOG_SUSBSCRIPTION,
      trackingHits: () => IAM_DATA_STREAMS_TRACKING_HITS.ACTIVITY,
      kind: /* @ngInject */ ($transition$) => $transition$.params().kind,
      goBack: /* @ngInject  */ ($state, kind, trackClick) => () => {
        trackClick(IAM_DATA_STREAMS_TRACKING_HITS.ACTIVITY.GO_BACK);
        return $state.go('iam.logs.activity', { kind }, { reload: true });
      },
    },
  });
};

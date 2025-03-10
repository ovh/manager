import { IAM_DATA_STREAMS_TRACKING_HITS } from './data-streams.constants';
import { name } from './data-streams.component';

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
      kind: /* @ngInject */ ($transition$) => $transition$.params().kind,
      goBack: /* @ngInject  */ ($state, kind, trackClick) => () => {
        trackClick(IAM_DATA_STREAMS_TRACKING_HITS.AUDIT.GO_BACK);
        return $state.go('iam.logs.audit', { kind }, { reload: true });
      },
    },
  });
};

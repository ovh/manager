import IplbHeaderTemplate from '../../header/iplb-dashboard-header.html';
import { IPLB_DATA_STREAMS_TRACKING_HITS } from '../logs.constants';
import { name } from './data-streams.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iplb.detail.logs.data-streams', {
    url: '',
    params: {
      kind: null,
    },
    views: {
      iplbHeader: {
        template: IplbHeaderTemplate,
        controller: 'IpLoadBalancerDashboardHeaderCtrl',
        controllerAs: 'ctrl',
      },
      'iplbContent@iplb.detail': name,
    },
    atInternet: {
      rename: IPLB_DATA_STREAMS_TRACKING_HITS.LISTING_PAGE,
    },
    resolve: {
      breadcrumb: () => null,
      url: /* @ngInject */ (serviceName) =>
        `/ipLoadbalancing/${serviceName}/log/subscription`,
      trackingHits: () => IPLB_DATA_STREAMS_TRACKING_HITS,
      kind: /* @ngInject */ ($transition$) => $transition$.params().kind,
      goBack: /* @ngInject  */ ($state, trackClick) => (kind) => {
        trackClick(IPLB_DATA_STREAMS_TRACKING_HITS.GO_BACK);
        return $state.go('iplb.detail.logs', { kind }, { reload: true });
      },
    },
  });
};

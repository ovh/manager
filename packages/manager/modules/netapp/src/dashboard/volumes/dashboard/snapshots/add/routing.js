import {
  SNAPSHOT_TRACKING_PREFIX,
  SNAPSHOT_LISTING_TRACKING_CONTEXT,
} from '../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.dashboard.volumes.dashboard.snapshots.add', {
    url: '/add',
    views: {
      modal: {
        component: 'ovhManagerNetAppVolumesDashboardSnapshotsAdd',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: /* @ngInject */ () => null,
    },
    atInternet: {
      ignore: true,
    },
    onEnter: /* @ngInject */ (atInternet) => {
      atInternet.trackPage({
        name: `${SNAPSHOT_TRACKING_PREFIX}netapp::popup::add::snapshot`,
        ...SNAPSHOT_LISTING_TRACKING_CONTEXT,
        page_category: 'popup',
      });
    },
  });
};

import {
  CLOUD_CONNECT_TRACKING_PREFIX,
  CLOUD_CONNECT_LISTING_TRACKING_CONTEXT,
} from '../../cloud-connect.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.details.statistics', {
    url: '/statistics',
    component: 'cloudConnectDetailsStatistics',
    atInternet: {
      rename: `${CLOUD_CONNECT_TRACKING_PREFIX}cloud-connect::dashboard::statistics`,
      ...CLOUD_CONNECT_LISTING_TRACKING_CONTEXT,
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('cloud_connect_statistics'),
    },
  });
};

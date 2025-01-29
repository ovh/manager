import { DIAGNOSTIC_TRACKING_PREFIX } from '../../cloud-connect.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.details.statistics', {
    url: '/statistics',
    component: 'cloudConnectDetailsStatistics',
    atInternet: {
      rename: `${DIAGNOSTIC_TRACKING_PREFIX}cloud-connect::dashboard::statistics`,
      level2: 99,
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('cloud_connect_statistics'),
    },
  });
};

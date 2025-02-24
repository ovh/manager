import {
  CLOUD_CONNECT_TRACKING_PREFIX,
  CLOUD_CONNECT_LISTING_TRACKING_CONTEXT,
} from '../../cloud-connect.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.details.tasks', {
    url: '/tasks',
    component: 'cloudConnectDetailsTasks',
    atInternet: {
      rename: `${CLOUD_CONNECT_TRACKING_PREFIX}cloud-connect::dashboard::tasks`,
      ...CLOUD_CONNECT_LISTING_TRACKING_CONTEXT,
    },
    resolve: {
      taskList: /* @ngInject */ (cloudConnectService, cloudConnect) =>
        cloudConnectService.loadAllTasks(cloudConnect.id),
      refreshTasks: /* @ngInject */ ($state) => () => {
        return $state.reload();
      },
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('cloud_connect_tasks'),
    },
  });
};

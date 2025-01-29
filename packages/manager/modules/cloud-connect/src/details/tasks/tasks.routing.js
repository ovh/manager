import { DIAGNOSTIC_TRACKING_PREFIX } from '../../cloud-connect.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.details.tasks', {
    url: '/tasks',
    component: 'cloudConnectDetailsTasks',
    atInternet: {
      rename: `${DIAGNOSTIC_TRACKING_PREFIX}cloud-connect::dashboard::tasks`,
      level2: 99,
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

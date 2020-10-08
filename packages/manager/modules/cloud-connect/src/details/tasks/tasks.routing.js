export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.details.tasks', {
    url: '/tasks',
    component: 'cloudConnectDetailsTasks',
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

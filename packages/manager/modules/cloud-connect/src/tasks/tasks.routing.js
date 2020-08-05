export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.tasks', {
    url: '/tasks',
    component: 'cloudConnectTasks',
    translations: {
      value: ['.'],
      format: 'json',
    },
    resolve: {
      taskList: /* @ngInject */ (cloudConnectService, cloudConnect) =>
        cloudConnectService.loadAllTasks(cloudConnect.id),
      refreshTasks: /* @ngInject */ ($state) => () => {
        return $state.reload();
      },
    },
  });
};

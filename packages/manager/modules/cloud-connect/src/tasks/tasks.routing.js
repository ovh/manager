export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.tasks', {
    url: '/tasks',
    component: 'cloudConnectTasks',
    translations: {
      value: ['.'],
      format: 'json',
    },
    resolve: {
      taskList: /* @ngInject */ (cloudConnectService, cloudConnectId) =>
        cloudConnectService.loadAllTasks(cloudConnectId),
      refreshTasks: /* @ngInject */ (cloudConnectService, $state) => () => {
        return $state.reload();
      },
    },
  });
};

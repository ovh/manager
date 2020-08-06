export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('overTheBoxes.overTheBox.tasks', {
    url: '/tasks',
    views: {
      otbView: 'overTheBoxTasks',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('overTheBox_tasks_list'),
    },
  });
};

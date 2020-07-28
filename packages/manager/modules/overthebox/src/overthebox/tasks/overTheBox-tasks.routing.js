export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('overTheBoxes.overTheBox.tasks', {
    url: '/tasks',
    views: {
      otbView: 'overTheBoxTasks',
    },
    translations: {
      value: ['.'],
      format: 'json',
    },
  });
};

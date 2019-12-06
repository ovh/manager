import angular from 'angular';
import controller from './overTheBox-tasks.controller';
import template from './overTheBox-tasks.html';

const moduleName = 'ovhManagerOtbTasks';

angular.module(moduleName, [])
  .config(($stateProvider) => {
    $stateProvider.state('overTheBoxes.overTheBox.tasks', {
      url: '/tasks',
      views: {
        otbView: {
          template,
          controller,
          controllerAs: 'OverTheBoxTasks',
        },
      },
      translations: {
        value: ['.'],
        format: 'json',
      },
    });
  });

export default moduleName;

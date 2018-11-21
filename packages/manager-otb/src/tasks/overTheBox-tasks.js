import angular from 'angular';
import controller from './overTheBox-tasks.controller';
import template from './overTheBox-tasks.html';

const moduleName = 'ovhManagerOtbTasks';

angular.module(moduleName, [])
  .config(($stateProvider) => {
    $stateProvider.state('telecom.overTheBox.tasks', {
      url: '/tasks',
      views: {
        'otbView@telecom.overTheBox': {
          template,
          controller,
          controllerAs: 'OverTheBoxTasks',
        },
      },
      translations: ['.'],
    });
  });

export default moduleName;

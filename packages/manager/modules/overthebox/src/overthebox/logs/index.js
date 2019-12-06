import angular from 'angular';
import controller from './overTheBox-logs.controller';
import template from './overTheBox-logs.html';

const moduleName = 'ovhManagerOtbLogs';

angular.module(moduleName, [])
  .config(($stateProvider) => {
    $stateProvider.state('overTheBoxes.overTheBox.logs', {
      url: '/logs',
      views: {
        otbView: {
          template,
          controller,
          controllerAs: 'OTBLogs',
        },
      },
      translations: {
        value: ['.'],
        format: 'json',
      },
    });
  });

export default moduleName;

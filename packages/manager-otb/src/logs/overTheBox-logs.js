import angular from 'angular';
import controller from './overTheBox-logs.controller';
import template from './overTheBox-logs.html';

const moduleName = 'ovhManagerOtbLogs';

angular.module(moduleName, [])
  .config(($stateProvider) => {
    $stateProvider.state('telecom.overTheBox.logs', {
      url: '/logs',
      views: {
        'otbView@telecom.overTheBox': {
          template,
          controller,
          controllerAs: 'OTBLogs',
        },
      },
      translations: ['.'],
    });
  });

export default moduleName;

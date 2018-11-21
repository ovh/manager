import angular from 'angular';
import controller from './overTheBox-configure.controller';
import template from './overTheBox-configure.html';

const moduleName = 'ovhManagerOtbConfigure';

angular.module(moduleName, [])
  .config(($stateProvider, $urlRouterProvider) => {
    $stateProvider.state('telecom.overTheBox-configure', {
      url: '/overTheBox/configure',
      views: {
        'telecomView@telecom': {
          template,
          controller,
          controllerAs: 'OverTheBoxConfigure',
        },
      },
      translations: ['.'],
    });

    // special redirection for /configure/overTheBox which is inside internal OTB UX
    $urlRouterProvider.when('/configure/overTheBox', '/overTheBox/configure');
  });

export default moduleName;

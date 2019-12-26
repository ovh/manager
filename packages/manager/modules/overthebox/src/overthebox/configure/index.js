import angular from 'angular';
import controller from './overTheBox-configure.controller';
import template from './overTheBox-configure.html';

const moduleName = 'ovhManagerOtbConfigure';

angular.module(moduleName, []).config(($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('overTheBox-configure', {
    url: '/overTheBox/configure',
    template,
    controller,
    controllerAs: 'OverTheBoxConfigure',
    translations: {
      value: ['.'],
      format: 'json',
    },
  });

  // special redirection for /configure/overTheBox which is inside internal OTB UX
  $urlRouterProvider.when('/configure/overTheBox', '/overTheBox/configure');
});

export default moduleName;

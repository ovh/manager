import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import './modems.scss';

const moduleName = 'ovhManagerTelecomSpareModemsLazyLoading';

angular
  .module(moduleName, [
    'ui.router',
    'oc.lazyLoad',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('spare.modems.**', {
      url: '/modems',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./modems.module')
          .then(mod => $ocLazyLoad.inject(mod.default || mod));
      },
    });
  });

export default moduleName;

import angular from 'angular';

import '@uirouter/angularjs';
import ocLazyLoad from 'oclazyload';

const moduleName = 'ovhManagerFreeFax';

angular
  .module(moduleName, [
    'ui.router',
    ocLazyLoad,
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('freefax.**', {
      url: '/freefax/:serviceName',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./freefax.component')
          .then(mod => $ocLazyLoad.inject(mod.default || mod));
      },
    });
  });

export default moduleName;

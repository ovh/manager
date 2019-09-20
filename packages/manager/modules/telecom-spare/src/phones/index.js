import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import './phones.scss';

const moduleName = 'ovhManagerTelecomSparePhonesLazyLoading';

angular
  .module(moduleName, [
    'ui.router',
    'oc.lazyLoad',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('spare.phones.**', {
      url: '/phones',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./phones.module')
          .then(mod => $ocLazyLoad.inject(mod.default || mod));
      },
    });
  });

export default moduleName;

import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';
import '@ovh-ux/ng-q-allsettled';
import '@ovh-ux/manager-core';

const moduleName = 'ovhManagerPack';

angular
  .module(moduleName, [
    'ngQAllSettled',
    'oc.lazyLoad',
    'ovhManagerCore',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('pack.**', {
      url: '/pack/:packName',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./pack')
          .then(mod => $ocLazyLoad.inject(mod.default || mod));
      },
    });
  });

export default moduleName;

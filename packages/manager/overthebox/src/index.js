import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerOtb';

angular.module(moduleName, [
  'ui.router',
  'oc.lazyLoad',
])
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider.state('overTheBox.**', {
      url: '/overTheBox/:serviceName',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./overTheBox.component')
          .then(mod => $ocLazyLoad.inject(mod.default || mod));
      },
    });
  });

export default moduleName;

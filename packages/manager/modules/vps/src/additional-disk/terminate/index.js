import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerVpsAdditionalDiskTerminateLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('vps.detail.additional-disk.terminate.**', {
      url: '/terminate',
      lazyLoad: ($transition$) => {
        return import('./terminate.module').then((mod) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return $ocLazyLoad.inject(mod.default || mod);
        });
      },
    });
  },
);
export default moduleName;

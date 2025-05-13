import angular from 'angular';

import '@uirouter/angularjs';
import 'oclazyload';

import './index.scss';

const moduleName = 'ovhManagerVpsMigrateLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('vps.detail.dashboard.migrate.**', {
      url: '/migrate',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
        return import('./migrate.module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });
  },
);

export default moduleName;

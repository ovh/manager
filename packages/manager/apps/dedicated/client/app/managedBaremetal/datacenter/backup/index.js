import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'managedBaremetalBackupLazyloading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'app.managedBaremetal.details.datacenters.datacenter.backup.**',
      {
        url: '/backup',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return import('./backup.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      },
    );
  },
);

export default moduleName;

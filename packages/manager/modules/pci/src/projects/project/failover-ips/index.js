import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import redirection from './redirection';

const moduleName = 'ovhManagerPciProjectFailoverIpsLazyLoading';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('pci.projects.project.failover-ips.**', {
        url: '/additional-ips',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./failover-ips.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  )
  .config(redirection);

export default moduleName;

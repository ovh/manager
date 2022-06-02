import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';
import '@ovh-ux/manager-core';

const moduleName = 'ovhManagerPciProjectAdditionalIpsOrderLazyLoading';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad', 'ovhManagerCore'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('pci.projects.project.additional-ips.order.**', {
        url: '/order',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return import('./order.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  );

export default moduleName;

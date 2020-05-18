import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import '@ovh-ux/manager-core';

import billingType from '../components/billing-type';
import nodePool from '../components/node-pool';

const moduleName = 'ovhManagerPciProjectKubernetesAddLazyloading';

angular
  .module(moduleName, [
    'ui.router',
    'ovhManagerCore',
    'oc.lazyLoad',
    nodePool,
    billingType,
  ])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('pci.projects.project.kubernetes.add.**', {
        url: '/new',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./add.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  );

export default moduleName;

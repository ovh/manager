/**
 * deprecated replaced by "@ovh-ux/manager-pci-private-network-app" µapp
 */

import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';
import globalRegions from './global-regions';
import localZone from './local-zone';

const moduleName = 'ovhManagerPciPrivateNetworksLazyLoading';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad', globalRegions, localZone])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('pci.projects.project.privateNetwork.**', {
        url: '/private-networks',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          const promise = import('./private-networks.module');
          return promise.then((mod) => $ocLazyLoad.inject(mod.default || mod));
        },
      });
    },
  );

export default moduleName;
